import { Component, OnInit } from '@angular/core';
import { IBill } from '@pos/models';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'pos-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
})
export class PeopleComponent implements OnInit {
  public bill!: IBill;
  public people = 0;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  ngOnInit() {
    this.bill = this.config.data.bill;
    this.people = this.bill.people ?? 0;
  }

  confirm() {
    this.ref.close(this.people);
  }

  cancel() {
    this.ref.close();
  }
}
