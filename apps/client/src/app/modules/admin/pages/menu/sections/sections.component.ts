import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '@pos/client/services/categories.service';
import { SectionsService } from '@pos/client/services/sections.service';
import { ICategory, IProduct, ISection } from '@pos/models';

@Component({
  selector: 'pos-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss'],
})
export class SectionsComponent implements OnInit {
  public sourceFilterValue = '';
  public categories: ICategory[] = [];
  public selectedCategory: ICategory | null = null;
  public products: IProduct[] = [];

  public id = this.route.snapshot.params['id'];

  public section: Partial<ISection> = {};

  constructor(
    private categoriesService: CategoriesService,
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
    this.categoriesService.getAllProducts().subscribe((categories) => {
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
