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
  IBillMenu,
  INewBillProduct,
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
      menus: this.menuService.getMenus({
        isActive: true,
      }),
      sections: this.sectionService.getSections(),
    }).subscribe(({ locations, tables, categories, bills, menus, sections }) => {
      this.categories = categories;
      this.bills = bills;
      this.locations = locations;
      this.tables = tables;
      this.menus = menus;
      this.sections = sections;
    });
  }

  selectTable(table: ITable) {
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
          this.selectedBill = { ...bill, billItems: [] };
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

  onSelectMenu(data: IBillMenu) {
    if (!this.selectedBill) {
      return;
    }
    this.billService.updateBillItem(this.selectedBill.id, data).subscribe();
    let item = this.selectedBill.billItems.find((val) => val.id === data.id);
    if (item) {
      item = data;
    } else {
      this.selectedBill.billItems.push(data);
    }
    this.calcTotal();
  }

  selectProduct(selectedProduct: IProduct) {
    if (!this.selectedBill) {
      return;
    }
    const product = this.selectedBill.billItems.find((val) => val.productId === selectedProduct.id);
    if (product) {
      product.quantity++;
      this.billService.updateBillItem(this.selectedBill.id, product).subscribe();
    } else {
      const newProduct: INewBillProduct = {
        id: uuid(),
        billId: this.selectedBill.id,
        name: selectedProduct.name,
        productId: selectedProduct.id,
        menuId: null,
        price: selectedProduct.price ?? 0,
        note: null,
        quantity: 1,
      };
      this.selectedBill.billItems.push(newProduct as IBillItem);
      this.billService.updateBillItem(this.selectedBill.id, newProduct).subscribe();
    }
    this.calcTotal();
  }

  changeQuantity(product: IBillItem, quantity: number) {
    if (!this.selectedBill) {
      return;
    }
    product.quantity = product.quantity + quantity;
    if (product.quantity < 1) {
      this.selectedBill.billItems = this.selectedBill.billItems.filter(
        (val) => val.id !== product.id
      );
      this.billService.deleteBillItem(this.selectedBill.id, product).subscribe();
    } else {
      this.billService.updateBillItem(this.selectedBill.id, product).subscribe();
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
    this.selectedBill.total = this.selectedBill?.billItems.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
    this.updateBill();
  }

  updateBill() {
    if (!this.selectedBill) {
      return;
    }
    const { billItems, ...bill } = this.selectedBill;
    this.billService.updateBill(bill).subscribe();
  }
}
