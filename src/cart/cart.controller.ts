import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, CartResponseDto, UpdateQuantityDto } from './dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
  ): Promise<CartResponseDto> {
    return this.cartService.addToCart(addToCartDto);
  }

  @Get()
  async getCart(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<CartResponseDto> {
    return this.cartService.getCartByUserId(userId);
  }

  @Patch(':itemId')
  async updateQuantity(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateQuantityDto,
  ): Promise<CartResponseDto> {
    return this.cartService.updateItemQuantity(itemId, updateDto);
  }

  @Delete(':itemId')
  async removeItem(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    await this.cartService.removeItem(itemId, userId);
    return { message: 'Item eliminado exitosamente' };
  }
}
