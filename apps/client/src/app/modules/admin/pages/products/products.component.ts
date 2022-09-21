import { Component, OnInit } from '@angular/core';
import { ICategory, IProduct } from '@pos/models';
import { ProductsService } from '@pos/client/services/products.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriesService } from '@pos/client/services/categories.service';

@Component({
  selector: 'pos-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: IProduct[] = [];
  categories: ICategory[] = [];
  product: Partial<IProduct> = {};
  selectedProducts: IProduct[] | null = null;
  productDialog = false;
  submitted = false;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.productsService.getOnlyProducts().subscribe((data) => (this.products = data));
    this.categoriesService.getCategories().subscribe((data) => (this.categories = data));
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedProducts?.forEach((product) => {
          this.productsService.deleteProduct(product.id).subscribe();
        });
        this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }

  editProduct(product: IProduct) {
    this.product = { ...product };
    this.productDialog = true;
  }

  deleteProduct(product: IProduct) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productsService.deleteProduct(product.id).subscribe();
        this.products = this.products.filter((val) => val.id !== product.id);
        this.product = {};

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;

    if (this.product?.name?.trim()) {
      if (this.product.id) {
        this.products[this.findIndexById(this.product.id)] = this.product as IProduct;
        this.productsService.updateProduct(this.product as IProduct).subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        this.products.push(this.product as IProduct);
        this.productsService.createProduct(this.product as IProduct).subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
