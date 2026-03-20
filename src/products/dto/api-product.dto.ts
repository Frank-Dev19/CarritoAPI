export class ApiProductResponse {
  id: number;
  title: string;
  brand: string;
  price: number;
  discountPercentage: number;
  thumbnail: string;
}

export class ApiProductsResponse {
  products: ApiProductResponse[];
  total: number;
  skip: number;
  limit: number;
}
