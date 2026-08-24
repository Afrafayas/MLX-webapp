import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('brand') brand?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('city') city?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.productsService.findAll({ search, category, brand, minPrice, maxPrice, city, sortBy });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Request() req: any, @Param('id') id: string) {
    return this.productsService.remove(id, req.user.id);
  }
}
