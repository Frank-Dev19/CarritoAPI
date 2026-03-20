import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductResponseDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(): Promise<ProductResponseDto[]> {
    return this.productsService.findAll();
  }
}
