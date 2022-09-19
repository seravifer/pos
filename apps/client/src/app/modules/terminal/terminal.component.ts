import { Component, OnInit } from '@angular/core';
import { BillsService } from '@pos/client/services/bill.service';
import { CategoriesService } from '@pos/client/services/categories.service';
import { LocationsService } from '@pos/client/services/locations.service';
import { MenusService } from '@pos/client/services/menu.service';
import { SectionsService } from '@pos/client/services/sections.service';
import { TableService } from '@pos/client/services/table.service';
import {
  IBill,
  IBillItem,
  ICategory,
  IProduct,
  ITable,
  ILocation,
  IMenu,
  ISection,
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
  public categories: ICategory[] = [];
  public bills: IBill[] = [];
  public locations: ILocation[] = [];
  public tables: ITable[] = [];
  public menus: IMenu[] = [];
  public sections: ISection[] = [];

  public selectedBill: IBill | null = null;
  public selectedCategory: ICategory | null = null;
  public selectedMenus = false;

  public pageShowing: 'bill' | 'map' = 'map';

  constructor(
    private categoriesService: CategoriesService,
    private billService: BillsService,
    private tableService: TableService,
    private locationsService: LocationsService,
    private menuService: MenusService,
    private sectionService: SectionsService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    combineLatest({
      categories: this.categoriesService.getAllProducts(),
      bills: this.billService.getBills(),
      locations: this.locationsService.getLocations(),
      tables: this.tableService.getTables(),
      menus: this.menuService.getMenus(),
      sections: this.sectionService.getSections(),
    }).subscribe(
      ({ locations, tables, categories, bills, menus, sections }) => {
        this.categories = categories;
        this.bills = bills;
        this.locations = locations;
        this.tables = tables;
        this.menus = menus;
        this.sections = sections;
      }
    );
  }

  onSelectTable(table: ITable) {
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

  selectBill(bill: IBill) {
    this.selectedBill = bill;
  }

  selectCategory(category: ICategory) {
    this.selectedCategory = category;
    this.selectedMenus = false;
  }

  selectMenu() {
    this.selectedCategory = null;
    this.selectedMenus = true;
  }

  onSelectMenu(data: any) {
    console.log(data);
  }

  onSelectProduct(product: IProduct) {
    if (!this.selectedBill) {
      return;
    }
    const exists = this.selectedBill.products.find(
      (val) => val.productId === product.id
    );
    if (exists) {
      exists.quantity++;
      this.billService.updateBillItem(this.selectedBill.id, exists).subscribe();
    } else {
      const newProduct: IBillItem = {
        id: uuid(),
        name: product.name,
        productId: product.id,
        price: product.price ?? 0,
        quantity: 1,
      };
      this.selectedBill.products.push(newProduct);
      this.billService
        .updateBillItem(this.selectedBill.id, newProduct)
        .subscribe();
    }
    this.calcTotal();
  }

  changeQuantity(product: IBillItem, quantity: number) {
    if (!this.selectedBill) {
      return;
    }
    product.quantity = product.quantity + quantity;
    if (product.quantity < 1) {
      this.selectedBill.products = this.selectedBill.products.filter(
        (val) => val.productId !== product.productId
      );
      this.billService
        .deleteBillItem(this.selectedBill.id, product)
        .subscribe();
    } else {
      this.billService
        .updateBillItem(this.selectedBill.id, product)
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
        this.updateBill();
      });
  }

  closeBill() {
    if (!this.selectedBill) return;
    this.selectedBill.closedAt = new Date();
    this.updateBill();
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
        this.updateBill();
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
    this.updateBill();
  }

  updateBill() {
    if (!this.selectedBill) {
      return;
    }
    const { products, ...bill } = this.selectedBill;
    this.billService.updateBill(bill).subscribe();
  }
}
