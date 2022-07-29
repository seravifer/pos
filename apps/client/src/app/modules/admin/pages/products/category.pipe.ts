import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '@pos/models';

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(value: number, categories: Category[]): string {
    return categories.find((category) => category.id === value)?.name ?? '-';
  }
}
