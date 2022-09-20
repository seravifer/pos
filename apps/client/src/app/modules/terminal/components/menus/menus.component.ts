import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ISection, IProduct, IMenu, IMenuSection, IBillMenu, ISectionProduct } from '@pos/models';
import { v4 as uuid } from 'uuid';

type CustomSection = ISection & IMenuSection;

@Component({
  selector: 'pos-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenusComponent {
  @Input() menus: IMenu[] = [];
  @Input() sections: ISection[] = [];

  @Output() selectedItems = new EventEmitter<IBillMenu>();

  public selectedMenu: IMenu | null = null;
  public selectedSection: CustomSection | null = null;

  public menuSections: CustomSection[] = [];
  public sectionProducts: ISectionProduct[] = [];

  public selected: Partial<IBillMenu> = {
    id: uuid(),
    sections: [],
  };

  selectMenu(menu: IMenu) {
    this.selectedMenu = menu;
    this.selected = {
      ...this.selected,
      productId: null,
      menuId: menu.id,
      name: menu.name,
      price: menu.price,
      quantity: 1,
      note: null,
    };
    this.menuSections = menu.sections.map((section) => {
      const s = this.sections.find((s) => s.id === section.sectionId)!;
      return {
        ...s,
        ...section,
      };
    });
  }

  selectSection(section: CustomSection) {
    this.selectedSection = section;
    this.sectionProducts = section.products;
  }

  selectProduct(product: ISectionProduct) {
    const section = this.selected.sections?.find(
      (section) => section.section?.id === this.selectedSection?.id
    );
    if (section) {
      section.products = [{ id: product.id, name: product.name, supplement: product.supplement }];
    } else {
      this.selected.sections?.push({
        id: uuid(),
        section: {
          id: this.selectedSection!.id,
          name: this.selectedSection!.name,
        },
        products: [{ id: product.id, name: product.name, supplement: product.supplement }],
      });
    }

    this.selectedItems.emit(this.selected as IBillMenu);
    // TODO: check maxProducts
  }

  isSectionCompleted(section: CustomSection) {
    return this.selected.sections?.some((s) => s.section?.id === section.id && s.products?.length);
  }

  isProductSelected(product: IProduct) {
    return this.selected.sections?.some((section) =>
      section.products?.some((p) => p.id === product.id)
    );
  }
}
