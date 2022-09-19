import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISection, INewMenu, IProduct } from '@pos/models';

type MenuItem = {
  menuId?: string;
  sections: {
    sectionId?: string;
    products?: string[];
  }[];
};

@Component({
  selector: 'pos-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
})
export class MenusComponent {
  @Input() menus: INewMenu[] = [];
  @Input() sections: ISection[] = [];

  @Output() selectedItems = new EventEmitter<MenuItem>();

  public selectedMenu: INewMenu | null = null;
  public selectedSection: ISection | null = null;

  public menuSections: ISection[] = [];
  public sectionProducts: IProduct[] = [];

  public selected: MenuItem = {
    sections: [],
  };

  constructor() {}

  selectMenu(menu: INewMenu) {
    this.selectedMenu = menu;
    this.selected.menuId = (menu as any).id;
    this.menuSections = menu.sections.map((section) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.sections.find((s) => s.id === section.sectionId)!;
    });
  }

  selectSection(section: ISection) {
    this.selectedSection = section;
    this.sectionProducts = section.products;
  }

  selectProduct(product: IProduct) {
    const section = this.selected.sections.find(
      (section) => section.sectionId === this.selectedSection?.id
    );
    if (section) {
      section.products = [product.id];
    } else {
      this.selected.sections.push({
        sectionId: this.selectedSection?.id,
        products: [product.id],
      });
    }
    this.selectedItems.emit(this.selected);
    // TODO: change next selection
    // TODO: check maxProducts
  }

  isProductSelected(product: IProduct) {
    return this.selected.sections.some((section) =>
      section.products?.some((id) => id === product.id)
    );
  }
}
