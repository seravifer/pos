import { Component, OnInit } from '@angular/core';
import { BillsService } from '@pos/client/services/bill.service';
import { LocationsService } from '@pos/client/services/locations.service';
import { ProductsService } from '@pos/client/services/products.service';
import { TableService } from '@pos/client/services/table.service';
import {
  BillWithProducts,
  IBillProduct,
  CategoryWithProducts,
  Product,
  Table,
  Location,
} from '@pos/models';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { PeopleComponent } from './components/people/people.component';

@Component({
  selector: 'pos-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit {
  public categories: CategoryWithProducts[] = [];
  public bills: BillWithProducts[] = [];
  public locations: Location[] = [];
  public tables: Table[] = [];

  public selectedBill: BillWithProducts | null = null;
  public selectedItem: IBillProduct | null = null;
  public selectedCategory: CategoryWithProducts | null = null;
  public pageShowing: 'bill' | 'map' = 'map';

  constructor(
    private productsService: ProductsService,
    private billService: BillsService,
    private tableService: TableService,
    private locationsService: LocationsService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.productsService.getAllProducts().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];
    });
    this.billService.getBills().subscribe((bills) => {
      this.bills = bills;
    });
    combineLatest({
      locations: this.locationsService.getLocations(),
      tables: this.tableService.getTables(),
    }).subscribe(({ locations, tables }) => {
      this.locations = locations;
      this.tables = tables;
    });
  }

  onSelectTable(table: Table) {
    const bill = this.bills.find((b) => b.tableId === table.id);
    if (bill) {
      this.selectedBill = bill;
    } else {
      this.billService
        .createBill({
          tableId: table.id,
        })
        .subscribe((bill) => {
          this.bills.push(bill);
          this.selectedBill = { ...bill, products: [] };
        });
    }
    this.pageShowing = 'bill';
  }

  selectBill(bill: BillWithProducts) {
    this.selectedBill = bill;
  }

  selectCategory(category: CategoryWithProducts) {
    this.selectedCategory = category;
  }

  onSelectProduct(product: Product) {
    if (!this.selectedBill) {
      return;
    }
    const exists = this.selectedBill.products.find(
      (val) => val.productId === product.id
    );
    if (exists) {
      exists.quantity++;
      this.billService
        .updateBillProduct(this.selectedBill.id, exists)
        .subscribe();
    } else {
      const newProduct: IBillProduct = {
        id: uuid(),
        name: product.name,
        productId: product.id,
        price: product.price ?? 0,
        quantity: 1,
      };
      this.selectedBill.products.push(newProduct);
      this.billService
        .updateBillProduct(this.selectedBill.id, newProduct)
        .subscribe();
    }
    this.calcTotal();
  }

  changeQuantity(product: IBillProduct, quantity: number) {
    if (!this.selectedBill) {
      return;
    }
    product.quantity = product.quantity + quantity;
    if (product.quantity < 1) {
      this.selectedBill.products = this.selectedBill.products.filter(
        (val) => val.productId !== product.productId
      );
      this.billService
        .deleteBillProduct(this.selectedBill.id, product)
        .subscribe();
    } else {
      this.billService
        .updateBillProduct(this.selectedBill.id, product)
        .subscribe();
    }
    this.calcTotal();
  }

  changePeople() {
    this.dialogService
      .open(PeopleComponent, {
        closable: false,
        data: {
          bill: this.selectedBill,
        },
      })
      .onClose.subscribe((people: number) => {
        if (!people || !this.selectedBill) return;
        this.selectedBill.people = people;
        this.billService.updateBill(this.selectedBill).subscribe();
      });
  }

  closeBill() {
    if (!this.selectedBill) return;
    this.selectedBill.closedAt = new Date();
    this.billService.updateBill(this.selectedBill).subscribe();
    this.bills = this.bills.filter((val) => !val.closedAt);
    this.selectedBill = null;
    this.pageShowing = 'map';
  }

  checkout() {
    this.dialogService
      .open(CheckoutComponent, {
        closable: false,
        data: {
          bill: this.selectedBill,
        },
      })
      .onClose.subscribe((payment: number) => {
        if (!payment || !this.selectedBill) return;
        this.selectedBill.paid = this.selectedBill.paid + payment;
        this.billService.updateBill(this.selectedBill).subscribe();
      });
  }

  private calcTotal() {
    if (!this.selectedBill) {
      return;
    }
    this.selectedBill.total = this.selectedBill?.products.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
    this.billService.updateBill(this.selectedBill).subscribe();
  }
}
