import { Component } from '@angular/core';
import { MenusService } from '@pos/client/services/menu.service';
import { SectionsService } from '@pos/client/services/sections.service';

@Component({
  selector: 'pos-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  public menu$ = this.menusService.getMenus();
  public sections$ = this.sectionsService.getSections();

  constructor(private sectionsService: SectionsService, private menusService: MenusService) {}
}
