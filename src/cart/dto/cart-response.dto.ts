export class CartItemResponseDto {
  idDetalle: number;
  idProducto: number;
  sku: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

export class CartResponseDto {
  idCarrito: number;
  idUsuario: number;
  totalCompra: number;
  fechaCreacion: Date;
  items: CartItemResponseDto[];
}
