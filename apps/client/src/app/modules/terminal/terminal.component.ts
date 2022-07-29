import { Component, OnInit } from '@angular/core';
import { BillsService } from '@pos/client/services/bill.service';
import { ProductsService } from '@pos/client/services/products.service';
import { TablesService } from '@pos/client/services/tables.service';
import {
  BillWithProducts,
  BProduct,
  CategoryWithProducts,
  Product,
  Table,
} from '@pos/models';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'pos-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss'],
})
export class TerminalComponent implements OnInit {
  public tables: Table[] = [];
  public bill!: BillWithProducts;
  public categories: CategoryWithProducts[] = [];
  public selectedCategory: CategoryWithProducts | null = null;
  public selectedItem: BProduct | null = null;
  public selectedItemId: string | null = null;

  constructor(
    private productsService: ProductsService,
    private tablesService: TablesService,
    private billService: BillsService
  ) {}

  ngOnInit(): void {
    this.tablesService.getTables().subscribe((tables) => {
      this.tables = tables;
    });
    this.productsService.getAllProducts().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];
    });
    this.billService.getBills().subscribe((bills) => {
      this.bill = bills[0];
    });
  }

  onSelectCategory(category: CategoryWithProducts) {
    this.selectedCategory = category;
  }

  onSelectProduct(product: Product) {
    const exists = this.bill.products.find(
      (val) => val.productId === product.id
    );
    if (exists) {
      exists.quantity++;
      this.billService.updateBillProduct(this.bill.id, exists).subscribe();
    } else {
      const newProduct: BProduct = {
        id: uuid(),
        name: product.name,
        productId: product.id,
        price: product.price ?? 0,
        quantity: 1,
      };
      this.bill.products.push(newProduct);
      this.billService.updateBillProduct(this.bill.id, newProduct).subscribe();
    }
    this.calcTotal();
  }

  changeQuantity(product: BProduct, quantity: number) {
    product.quantity = product.quantity + quantity;
    if (product.quantity < 1) {
      this.bill.products = this.bill.products.filter(
        (val) => val.productId !== product.productId
      );
      this.billService.deleteBillProduct(this.bill.id, product).subscribe();
    } else {
      this.billService.updateBillProduct(this.bill.id, product).subscribe();
    }
    this.calcTotal();
  }

  private calcTotal() {
    this.bill.total = this.bill?.products.reduce(
      (acc, cur) => acc + cur.price * cur.quantity,
      0
    );
  }

  onSelectTable(table: Table) {
    // TODO
    this.bill.tableId = table.id;
  }
}
