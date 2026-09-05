import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const role = dto.role || 'customer';

    if (!dto.password) {
      throw new BadRequestException('Password is required');
    }

    if (role === 'seller') {
      if (!dto.email) {
        throw new BadRequestException('Email is required for seller registration');
      }
    } else {
      if (!dto.phone && !dto.email) {
        throw new BadRequestException('Phone number or email is required for customer registration');
      }
    }

    // Check existing user
    if (dto.email) {
      const existingEmail = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
      });
      if (existingEmail) {
        throw new BadRequestException('Email is already registered');
      }
    }

    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new BadRequestException('Phone number is already registered');
      }
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email ? dto.email.toLowerCase() : null,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone || null,
        role: role,
      },
      include: {
        shop: true,
      },
    });

    const token = this.generateToken(user.id, user.email || user.phone || user.id, user.role);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Please provide email or phone number to login');
    }

    if (!dto.password) {
      throw new BadRequestException('Please provide password');
    }

    let user: any = null;
    if (dto.email) {
      user = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
        include: { shop: true },
      });
    } else if (dto.phone) {
      user = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
        include: { shop: true },
      });
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    const token = this.generateToken(user.id, user.email || user.phone || user.id, user.role);

    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { shop: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
