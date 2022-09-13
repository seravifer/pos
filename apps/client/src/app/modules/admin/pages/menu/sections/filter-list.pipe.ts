import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterList',
})
export class FilterListPipe implements PipeTransform {
  transform(list: any[], filterList: any[]): any {
    return list.filter((l) => !filterList.some((f) => f.id === l.id));
  }
}
