import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NumberPadComponent } from './number-pad.component';

@NgModule({
  imports: [CommonModule],
  exports: [NumberPadComponent],
  declarations: [NumberPadComponent],
  providers: [],
})
export class NumberPadModule {}
