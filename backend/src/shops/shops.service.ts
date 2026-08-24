import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopsService {
  constructor(private prisma: PrismaService) {}

  async createOrUpdateForOwner(ownerId: string, dto: CreateShopDto) {
    const existing = await this.prisma.shop.findUnique({
      where: { ownerId },
    });

    if (existing) {
      return this.prisma.shop.update({
        where: { ownerId },
        data: dto,
      });
    }

    return this.prisma.shop.create({
      data: {
        ...dto,
        ownerId,
      },
    });
  }

  async findAll(query?: { city?: string; category?: string; search?: string }) {
    const where: any = {};

    if (query?.city) {
      where.city = { contains: query.city };
    }

    if (query?.category) {
      where.category = query.category;
    }

    if (query?.search) {
      where.OR = [
        { name: { contains: query.search } },
        { address: { contains: query.search } },
        { city: { contains: query.search } },
      ];
    }

    return this.prisma.shop.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with ID ${id} not found`);
    }

    return shop;
  }
}
