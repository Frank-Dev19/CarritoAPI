export class ProductResponseDto {
  id: number;
  title: string;
  brand: string;
  price: number;
  discountPercentage: number;
  totalPrice: number;
  thumbnail: string;
  sku: string;
}

export class ProductsPaginatedResponse {
  products: ProductResponseDto[];
  total: number;
  skip: number;
  limit: number;
}
