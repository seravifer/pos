import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bill } from '@pos/models';

@Component({
  selector: 'pos-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent {
  @Input() bill: Bill | null = null;
  @Output() checkout = new EventEmitter<number>();

  public payment = 0;
  public type: 'cash' | 'card' = 'cash';

  public paymentOptions = [
    { name: 'Tarjeta', code: 'card' },
    { name: 'Efectivo', code: 'cash' },
  ];

  confirm() {
    this.checkout.emit(this.payment);
  }
}
