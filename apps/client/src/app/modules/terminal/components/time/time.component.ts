import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'pos-time',
  template: `{{ time$ | async | date: 'HH:mm' }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeComponent {
  public time$ = timer(0, 1_000).pipe(map(() => new Date()));
}
