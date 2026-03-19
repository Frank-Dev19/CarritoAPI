export class MathUtils {
  static calculateOriginalPrice(
    discountedPrice: number,
    discountPercentage: number,
  ): number {
    if (discountPercentage >= 100) {
      return discountedPrice;
    }
    if (discountPercentage <= 0) {
      return discountedPrice;
    }
    const originalPrice = discountedPrice / (1 - discountPercentage / 100);
    return Math.round(originalPrice * 100) / 100;
  }
}
