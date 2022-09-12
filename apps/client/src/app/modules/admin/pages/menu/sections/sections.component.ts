import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@pos/client/services/products.service';
import { SectionsService } from '@pos/client/services/sections.service';
import { CategoryWithProducts, Product, Section } from '@pos/models';

@Component({
  selector: 'pos-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent implements OnInit {
  public sourceFilterValue = '';
  public categories: CategoryWithProducts[] = [];
  public selectedCategory: CategoryWithProducts | null = null;
  public products: Product[] = [];

  public id = this.route.snapshot.params['id'];

  public section: Partial<Section> = {};

  constructor(
    private productsService: ProductsService,
    private sectionsService: SectionsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.id) {
      this.sectionsService.getSection(this.id).subscribe((section) => {
        this.section = section;
        this.products = section.products;
      });
    }
    this.productsService.getAllProducts().subscribe((categories) => {
      this.categories = categories;
      this.selectedCategory = categories[0];
    });
  }

  onSave() {
    if (this.id) {
      this.sectionsService
        .updateSection({ ...this.section, products: this.products })
        .subscribe();
    } else {
      this.sectionsService
        .createSection({ ...this.section, products: this.products })
        .subscribe((res) => {
          this.router.navigate([res.id], {
            replaceUrl: true,
            relativeTo: this.route,
          });
        });
    }
  }

  onDelete() {
    if (!this.id) return;
    this.sectionsService.deleteSection(this.id).subscribe();
  }
}
