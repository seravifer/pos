import { IBillItem } from '@pos/models';

export function calcPrice(item: IBillItem): number {
  if (item.menuId && item.sections) {
    return item.sections.reduce((total, section) => {
      return (
        total +
        section.products.reduce((productTotal, product) => productTotal + product.supplement, 0)
      );
    }, item.price);
  }
  if (item.productId) {
    return item.price * item.quantity;
  }
  return item.price;
}
