import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities';
import { AddToCartDto, CartResponseDto, CartItemResponseDto, UpdateQuantityDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async addToCart(addToCartDto: AddToCartDto): Promise<CartResponseDto> {
    await this.validateUserExists(addToCartDto.idUsuario);

    const order = await this.getOrCreateOrder(addToCartDto.idUsuario);

    const requestedQuantity = addToCartDto.cantidad || 1;

    const existingItem = await this.findExistingItem(
      order.idCarrito,
      addToCartDto.idProducto,
    );

    if (existingItem) {
      await this.addQuantityToItem(
        existingItem,
        requestedQuantity,
        addToCartDto.idProducto,
      );
    } else {
      await this.validateStock(addToCartDto.idProducto, requestedQuantity);
      await this.addNewItem(order.idCarrito, addToCartDto);
    }

    await this.recalculateTotal(order.idCarrito);

    return this.getCartByUserId(addToCartDto.idUsuario);
  }

  async getCartByUserId(idUsuario: number): Promise<CartResponseDto> {
    const order = await this.findOrderByUserId(idUsuario);
    return this.mapToCartResponse(order);
  }

  async removeItem(itemId: number, userId: number): Promise<void> {
    const item = await this.findItemWithOrder(itemId);
    this.validateItemBelongsToUser(item, userId);

    const orderId = item.order.idCarrito;

    await this.orderItemRepository.remove(item);

    await this.recalculateTotal(orderId);
  }

  async updateItemQuantity(
    itemId: number,
    updateDto: UpdateQuantityDto,
  ): Promise<CartResponseDto> {
    const item = await this.findItemWithOrder(itemId);
    this.validateItemBelongsToUser(item, updateDto.idUsuario);

    await this.validateStock(item.idProducto, updateDto.cantidad);

    item.cantidad = updateDto.cantidad;
    await this.orderItemRepository.save(item);

    await this.recalculateTotal(item.order.idCarrito);

    return this.getCartByUserId(updateDto.idUsuario);
  }

  private async validateUserExists(userId: number): Promise<void> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
  }

  private async getOrCreateOrder(userId: number): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: { idUsuario: userId },
      relations: ['items'],
    });

    if (!order) {
      order = this.orderRepository.create({
        idUsuario: userId,
        totalCompra: 0,
      });
      order = await this.orderRepository.save(order);
    }

    return order;
  }

  private async validateStock(
    productId: number,
    requestedQuantity: number,
  ): Promise<void> {
    const availableStock =
      await this.productsService.getProductStock(productId);

    if (requestedQuantity > availableStock) {
      throw new BadRequestException(
        `No puede agregar ${requestedQuantity} items. Solo hay ${availableStock} unidades disponibles en stock.`,
      );
    }
  }

  private async findExistingItem(
    orderId: number,
    productId: number,
  ): Promise<OrderItem | null> {
    return this.orderItemRepository.findOne({
      where: {
        idCarrito: orderId,
        idProducto: productId,
      },
    });
  }

  private async addQuantityToItem(
    existingItem: OrderItem,
    quantityToAdd: number,
    productId: number,
  ): Promise<void> {
    const newQuantity = existingItem.cantidad + quantityToAdd;

    await this.validateStock(productId, newQuantity);

    existingItem.cantidad = newQuantity;
    await this.orderItemRepository.save(existingItem);
  }

  private async addNewItem(orderId: number, dto: AddToCartDto): Promise<void> {
    let imagen = dto.imagen;

    if (!imagen) {
      const product = await this.productsService.getProductById(dto.idProducto);
      imagen = product?.thumbnail || '';
    }

    const orderItem = this.orderItemRepository.create({
      idCarrito: orderId,
      idProducto: dto.idProducto,
      sku: dto.sku,
      precio: dto.precio,
      cantidad: dto.cantidad || 1,
      imagen,
    });
    await this.orderItemRepository.save(orderItem);
  }

  private async recalculateTotal(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { idCarrito: orderId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const total = order.items.reduce((sum, item) => {
      const itemTotal = parseFloat(item.precio.toString()) * item.cantidad;
      return sum + itemTotal;
    }, 0);

    order.totalCompra = Math.round(total * 100) / 100;
    await this.orderRepository.save(order);
  }

  private async findOrderByUserId(userId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { idUsuario: userId },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Cart not found for user with id ${userId}`);
    }

    return order;
  }

  private async findItemWithOrder(itemId: number): Promise<OrderItem> {
    const item = await this.orderItemRepository.findOne({
      where: { idDetalle: itemId },
      relations: ['order'],
    });

    if (!item) {
      throw new NotFoundException(`Item con id ${itemId} no encontrado`);
    }

    return item;
  }

  private validateItemBelongsToUser(item: OrderItem, userId: number): void {
    if (item.order.idUsuario !== userId) {
      throw new NotFoundException(
        `Item con id ${item.idDetalle} con pertenece al usuario con id ${userId}`,
      );
    }
  }

  private mapToCartResponse(order: Order): CartResponseDto {
    const items: CartItemResponseDto[] = order.items.map((item) => ({
      idDetalle: item.idDetalle,
      idProducto: item.idProducto,
      sku: item.sku,
      precio: parseFloat(item.precio.toString()),
      cantidad: item.cantidad,
      imagen: item.imagen,
    }));

    return {
      idCarrito: order.idCarrito,
      idUsuario: order.idUsuario,
      totalCompra: parseFloat(order.totalCompra.toString()),
      fechaCreacion: order.fechaCreacion,
      items,
    };
  }
}
