import { Controller, Get, Param, Post } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductDto } from './dtos/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@Serialize(ProductDto)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.findAll({ prices: 0 }, [
      { path: 'website', select: 'name' },
    ]);
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findOneById(id, [
      { path: 'website', select: 'name' },
    ]);
  }
}
