import { Pipe, PipeTransform } from '@angular/core';
import { IBillItem } from '@pos/models';
import { calcPrice } from './price';

@Pipe({
  name: 'totalPrice',
  pure: false,
})
export class TotalPricePipe implements PipeTransform {
  transform(item: IBillItem): number {
    return calcPrice(item);
  }
}
