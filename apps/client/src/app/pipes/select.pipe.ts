import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'select',
  pure: true,
  standalone: true,
})
export class SelectPipe implements PipeTransform {
  transform<T extends { id: string }>(id: string | null = '', list: T[]): T | undefined {
    return list.find((item) => item.id === id);
  }
}
