import { Pipe, PipeTransform } from '@angular/core';
import { ICategory } from '@pos/models';

@Pipe({
  name: 'category',
})
export class CategoryPipe implements PipeTransform {
  transform(id: string, categories: ICategory[]): string {
    return categories.find((category) => category.id === id)?.name ?? '-';
  }
}
