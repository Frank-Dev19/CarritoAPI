import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  ApiProductsResponse,
  ApiProductResponse,
  ProductResponseDto,
} from './dto';
import { MathUtils } from '../common/utils/math.utils';
import { EXTERNAL_API } from '../common/constants';

@Injectable()
export class ProductsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<ProductResponseDto[]> {
    const baseUrl = this.configService.get<string>(
      'app.externalApiUrl',
      EXTERNAL_API.BASE_URL,
    );
    const url = `${baseUrl}${EXTERNAL_API.PRODUCTS_ENDPOINT}`;

    const response = await this.httpService
      .get<ApiProductsResponse>(url)
      .toPromise();

    if (!response) {
      return [];
    }

    const products = response.data.products;

    return products.map((product: ApiProductResponse) =>
      this.transformProduct(product),
    );
  }

  private transformProduct(product: ApiProductResponse): ProductResponseDto {
    const totalPrice = MathUtils.calculateOriginalPrice(
      product.price,
      product.discountPercentage,
    );

    return {
      id: product.id,
      title: product.title,
      brand: product.brand,
      price: product.price,
      discountPercentage: product.discountPercentage,
      totalPrice,
      thumbnail: product.thumbnail,
    };
  }
}
