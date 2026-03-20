import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  ApiProductsResponse,
  ApiProductResponse,
  ProductResponseDto,
  ProductsPaginatedResponse,
} from './dto';
import { MathUtils } from '../common/utils/math.utils';
import { EXTERNAL_API } from '../common/constants';

@Injectable()
export class ProductsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 15,
  ): Promise<ProductsPaginatedResponse> {
    const baseUrl = this.configService.get<string>(
      'app.externalApiUrl',
      EXTERNAL_API.BASE_URL,
    );
    const skip = (page - 1) * limit;
    const url = `${baseUrl}${EXTERNAL_API.PRODUCTS_ENDPOINT}?skip=${skip}&limit=${limit}`;

    const response = await this.httpService
      .get<ApiProductsResponse>(url)
      .toPromise();

    if (!response) {
      return { products: [], total: 0, skip: 0, limit };
    }

    const products = response.data.products.map((product: ApiProductResponse) =>
      this.transformProduct(product),
    );

    return {
      products,
      total: response.data.total,
      skip: response.data.skip,
      limit,
    };
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
      sku: product.sku,
    };
  }

  async getProductStock(productId: number): Promise<number> {
    const baseUrl = this.configService.get<string>(
      'app.externalApiUrl',
      EXTERNAL_API.BASE_URL,
    );
    const url = `${baseUrl}${EXTERNAL_API.PRODUCTS_ENDPOINT}/${productId}`;

    const response = await this.httpService
      .get<ApiProductResponse>(url)
      .toPromise();

    if (!response || !response.data) {
      return 0;
    }

    return response.data.stock ?? 0;
  }

  async getProductById(productId: number): Promise<ApiProductResponse | null> {
    const baseUrl = this.configService.get<string>(
      'app.externalApiUrl',
      EXTERNAL_API.BASE_URL,
    );
    const url = `${baseUrl}${EXTERNAL_API.PRODUCTS_ENDPOINT}/${productId}`;

    const response = await this.httpService
      .get<ApiProductResponse>(url)
      .toPromise();

    if (!response || !response.data) {
      return null;
    }

    return response.data;
  }
}
