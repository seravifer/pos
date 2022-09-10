import { Component, OnInit } from '@angular/core';
import { BillsService } from '@pos/client/services/bill.service';
import { ProductsService } from '@pos/client/services/products.service';
import {
  BillWithProducts,
  BProduct,
  CategoryWithProducts,
  Product,
} from '@pos/models';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'pos-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit {
  public bills: BillWithProducts[] = [];
  public selectedBill: BillWithProducts | null = null;

  public categories: CategoryWithProducts[] = [];
  public selectedCategory: CategoryWithProducts | null = null;

  public selectedItem: BProduct | null = null;
  public selectedItemId: string | null = null;

  public showCheckout = false;

  constructor(
    private productsService: ProductsService,
    private billService: BillsService
  ) {}

  ngOnInit(): void {
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
      this.selectedBill = bill;
    });
  }

  onSelectBill(bill: BillWithProducts) {
    this.selectedBill = bill;
  }

  onSelectCategory(category: CategoryWithProducts) {
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
      const newProduct: BProduct = {
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

  changeQuantity(product: BProduct, quantity: number) {
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

  onClose() {
    if (!this.selectedBill) {
      return;
    }
    this.selectedBill.closedAt = new Date();
    this.billService.updateBill(this.selectedBill).subscribe();
    this.selectedBill = null;
  }

  onCheckout(payment: number) {
    if (!this.selectedBill) {
      return;
    }
    this.selectedBill.paid = payment;
    this.showCheckout = false;
    this.billService.updateBill(this.selectedBill).subscribe();
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
