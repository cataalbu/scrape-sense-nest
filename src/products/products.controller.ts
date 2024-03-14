import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductDto, ProductListDto } from './dtos/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @Serialize(ProductListDto)
  getProducts(@Query('skip') skip: number, @Query('limit') limit: number) {
    return this.productsService.findAllPaginated(skip, limit, { prices: 0 }, [
      { path: 'website', select: 'name' },
    ]);
  }

  @Get('/:id')
  @Serialize(ProductDto)
  getProduct(@Param('id') id: string) {
    return this.productsService.findOneById(id, [
      { path: 'website', select: 'name' },
    ]);
  }
}
