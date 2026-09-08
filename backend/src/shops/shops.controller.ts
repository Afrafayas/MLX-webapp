import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopsService } from './shops.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('mine')
  async createOrUpdateMine(@Request() req: any, @Body() dto: CreateShopDto) {
    return this.shopsService.createOrUpdateForOwner(req.user.id, dto);
  }

  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.shopsService.findAll({ city, category, search });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.shopsService.findOne(id);
  }
}
