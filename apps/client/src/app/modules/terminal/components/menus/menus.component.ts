import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IProduct, IMenu, IMenuSection, IBillMenu, ISectionProduct } from '@pos/models';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'pos-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenusComponent implements OnInit, OnChanges {
  @Input() billMenu: IBillMenu | null = null;

  @Input() menus: IMenu[] = [];

  @Output() selectedItems = new EventEmitter<IBillMenu>();

  public selectedMenu: IMenu | null = null;
  public selectedSection: IMenuSection | null = null;

  public selected: Partial<IBillMenu> = {
    id: uuid(),
    sections: [],
  };

  ngOnInit() {
    this.reset();
    if (this.billMenu != null) {
      this.selected = structuredClone(this.billMenu);
      this.selectedMenu = this.menus.find((menu) => menu.id === this.selected.menuId)!;
      this.selectedSection = this.selectedMenu!.sections[0];
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['billMenu']) {
      this.ngOnInit();
    }
  }

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
  }

  selectSection(section: IMenuSection) {
    this.selectedSection = section;
  }

  selectProduct(product: ISectionProduct) {
    if (!this.selectedMenu || !this.selectedSection) return;
    const section = this.selected.sections?.find(
      (section) => section.section?.id === this.selectedSection?.id
    );
    const addedProduct = { id: product.id, name: product.name, supplement: product.supplement };
    if (section) {
      if (this.selectedSection.maxProducts > section.products?.length) {
        section.products = [...section.products, addedProduct];
        return;
      }
      const index = section.products?.findIndex((p) => p.id === product.id);
      if (index > -1) {
        section.products?.splice(index, 1);
      }
    } else {
      this.selected.sections?.push({
        id: uuid(),
        section: {
          id: this.selectedSection.id,
          name: this.selectedSection.name,
        },
        products: [addedProduct],
      });
    }
    this.selected.price = this.selectedMenu.price + product.supplement;
  }

  reset() {
    this.selectedMenu = null;
    this.selectedSection = null;
    this.selected = {
      id: uuid(),
      sections: [],
    };
  }

  confirm() {
    this.selectedItems.emit(this.selected as IBillMenu);
    this.reset();
  }

  isSectionCompleted(section: IMenuSection) {
    return this.selected.sections?.some((s) => s.section?.id === section.id && s.products?.length);
  }

  isProductSelected(product: IProduct) {
    return this.selected.sections?.some((section) =>
      section.products?.some((p) => p.id === product.id)
    );
  }
}
