import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '@pos/client/services/categories.service';
import { Category, ICONS } from '@pos/models';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'pos-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  public categories: Category[] = [];
  public category: Partial<Category> = {};
  public selectedCategories!: Category[] | null;
  public categoryDialog = false;
  public submitted = false;

  public COLORS = [
    '#264653ff',
    '#2a9d8fff',
    '#e9c46aff',
    '#f4a261ff',
    '#e76f51ff',
  ];

  public ICONS = ICONS;

  constructor(
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.categoriesService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  openNew() {
    this.category = {};
    this.submitted = false;
    this.categoryDialog = true;
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedCategories?.forEach((product) => {
          this.categoriesService.deleteCategory(product).subscribe();
        });
        this.categories = this.categories.filter(
          (val) => !this.selectedCategories?.includes(val)
        );
        this.selectedCategories = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Categorys Deleted',
          life: 3000,
        });
      },
    });
  }

  editCategory(category: Category) {
    this.category = { ...category, icon: category.icon ?? this.ICONS[0] };
    this.categoryDialog = true;
  }

  deleteCategory(product: Category) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoriesService.deleteCategory(product).subscribe();
        this.categories = this.categories.filter(
          (val) => val.id !== product.id
        );
        this.category = {};

        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Deleted',
          life: 3000,
        });
      },
    });
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;

    if (this.category?.name?.trim()) {
      if (this.category.id) {
        this.categories[this.findIndexById(this.category.id)] = this
          .category as Category;
        this.categoriesService
          .updateCategory(this.category as Category)
          .subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Updated',
          life: 3000,
        });
      } else {
        this.categories.push(this.category as Category);
        this.categoriesService
          .createCategory(this.category as Category)
          .subscribe();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Created',
          life: 3000,
        });
      }

      this.categories = [...this.categories];
      this.categoryDialog = false;
      this.category = {};
    }
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.categories.length; i++) {
      if (this.categories[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }
}
