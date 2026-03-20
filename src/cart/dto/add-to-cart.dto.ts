import {
  IsNumber,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
  Min,
} from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  idUsuario: number;

  @IsNumber()
  @IsNotEmpty()
  idProducto: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @IsNumber()
  @IsNotEmpty()
  precio: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  cantidad?: number;

  @IsString()
  @IsOptional()
  imagen?: string;
}
