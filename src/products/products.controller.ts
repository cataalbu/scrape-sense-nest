import { Controller, Get, Param } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductDto } from './dtos/product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@Serialize(ProductDto)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts() {
    return this.productsService.findAll();
  }

  @Get('/:id')
  getProduct(@Param('id') id: string) {
    return this.productsService.findOneById(id);
  }
}
