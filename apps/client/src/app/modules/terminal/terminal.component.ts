import { Component, OnInit } from '@angular/core';
import { BillsService } from '@pos/client/services/bill.service';
import { ProductsService } from '@pos/client/services/products.service';
import {
  BillWithProducts,
  IBillProduct,
  CategoryWithProducts,
  Product,
} from '@pos/models';
import { DialogService } from 'primeng/dynamicdialog';
import { v4 as uuid } from 'uuid';
import { CheckoutComponent } from './components/checkout/checkout.component';

@Component({
  selector: 'pos-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
  providers: [DialogService],
})
export class TerminalComponent implements OnInit {
  public categories: CategoryWithProducts[] = [];
  public bills: BillWithProducts[] = [];

  public selectedBill: BillWithProducts | null = null;
  public selectedItem: IBillProduct | null = null;

  public selectedCategory: CategoryWithProducts | null = null;

  constructor(
    private productsService: ProductsService,
    private billService: BillsService,
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
  }

  newBill() {
    this.billService.createBill({}).subscribe((bill) => {
      this.bills.push(bill);
      this.selectedBill = { ...bill, products: [] };
    });
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

  closeBill() {
    if (!this.selectedBill) {
      return;
    }
    this.selectedBill.closedAt = new Date();
    this.billService.updateBill(this.selectedBill).subscribe();
    this.selectedBill = null;
    this.bills = this.bills.filter((val) => !val.closedAt);
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
        this.selectedBill.closedAt = new Date();
        this.billService.updateBill(this.selectedBill).subscribe();
        this.selectedBill = null;
        this.bills = this.bills.filter((val) => !val.closedAt);
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
