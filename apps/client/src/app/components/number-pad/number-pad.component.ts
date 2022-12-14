import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'pos-number-pad',
  templateUrl: './number-pad.component.html',
  styleUrls: ['./number-pad.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberPadComponent),
      multi: true,
    },
  ],
})
export class NumberPadComponent {
  public integral = '';
  public decimal = '';
  public hasDecimal = false;

  @Input() hasComma = true;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  emitValue() {
    const value =
      (this.integral.length > 0 ? this.integral : '0') +
      '.' +
      (this.decimal.length > 0 ? this.decimal : '0');
    this.onTouch();
    this.onChange(+value);
  }

  writeValue(value: number) {
    if (typeof value == 'number') {
      this.integral = Math.trunc(value) + '';
      this.decimal = value.toString().split('.')[1] ?? '';
      if (parseInt(this.decimal) > 0) {
        this.hasDecimal = true;
      } else {
        this.hasDecimal = false;
      }
    }
  }

  registerOnChange(fn: typeof this.onChange) {
    this.onChange = fn;
  }

  registerOnTouched(fn: typeof this.onTouch) {
    this.onTouch = fn;
  }

  public onNumber(num: number) {
    if (this.hasDecimal) {
      if (this.decimal.length < 2) {
        this.decimal += num + '';
      }
    } else {
      this.integral += num + '';
    }
    this.emitValue();
  }

  public onComma() {
    this.hasDecimal = true;
  }

  public onDelete() {
    if (this.hasDecimal) {
      if (this.decimal.length === 0) {
        this.hasDecimal = false;
      } else {
        this.decimal = this.decimal.slice(0, -1);
      }
    } else {
      this.integral = this.integral.slice(0, -1);
    }
    this.emitValue();
  }

  public onClear() {
    this.integral = '';
    this.decimal = '';
    this.hasDecimal = false;
    this.emitValue();
  }
}
