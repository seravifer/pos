import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '@pos/models';

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(id: string, categories: Category[]): string {
    return categories.find((category) => category.id === id)?.name ?? '-';
  }
}
