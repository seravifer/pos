import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBill } from '@pos/models';

@Component({
  selector: 'pos-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss'],
})
export class TicketsComponent {
  public tickets: IBill[] = [];

  @Input()
  set bills(bills: IBill[]) {
    this.tickets = bills.filter((bill) => !bill.tableId);
  }
  get bills(): IBill[] {
    return this.tickets;
  }

  @Output() selectedBill = new EventEmitter<IBill>();

  selectTicket(ticket: IBill) {
    this.selectedBill.emit(ticket);
  }
}
