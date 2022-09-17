import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CalculatorComponent } from './calculator.component';

@NgModule({
  imports: [CommonModule],
  exports: [CalculatorComponent],
  declarations: [CalculatorComponent],
  providers: [],
})
export class CalculatorModule {}
