import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLeadDto) {
    const shop = await this.prisma.shop.findUnique({ where: { id: dto.shopId } });
    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    return this.prisma.lead.create({
      data: {
        shopId: dto.shopId,
        productId: dto.productId,
        productName: dto.productName,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        contactType: dto.contactType,
      },
    });
  }

  async getSellerLeads(sellerUserId: string) {
    const shop = await this.prisma.shop.findUnique({ where: { ownerId: sellerUserId } });
    if (!shop) {
      throw new ForbiddenException('No shop found for this seller account');
    }

    return this.prisma.lead.findMany({
      where: { shopId: shop.id },
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });
  }
}
