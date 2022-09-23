import { Component, OnInit } from '@angular/core';
import { IBill } from '@pos/models';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'pos-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  public bill!: IBill;

  public payment = 0;
  public type: 'cash' | 'card' = 'cash';

  public paymentOptions = [
    { name: 'Tarjeta', code: 'card', icon: 'pi pi-credit-card' },
    { name: 'Efectivo', code: 'cash', icon: 'pi pi-euro' },
  ];

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

  ngOnInit() {
    this.bill = this.config.data.bill;
  }

  clean() {
    this.payment = 0;
  }

  all() {
    this.payment = this.bill.total - this.bill.paid;
  }

  confirm() {
    this.ref.close(this.payment);
  }

  cancel() {
    this.ref.close();
  }
}
