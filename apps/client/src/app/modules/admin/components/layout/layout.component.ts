import { Component } from '@angular/core';

@Component({
  selector: 'pos-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  public menu = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      routerLink: '/admin/dashboard',
    },
    {
      label: 'Categorías',
      icon: 'pi pi-bookmark',
      routerLink: '/admin/categories',
    },
    {
      label: 'Productos',
      icon: 'pi pi-align-left',
      routerLink: '/admin/products',
    },
    {
      label: 'Editor de menús',
      icon: 'pi pi-book',
      routerLink: '/admin/menu',
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-user',
      routerLink: '/admin/users',
    },
    {
      label: 'Mapa del local',
      icon: 'pi pi-sitemap',
      routerLink: '/admin/map-editor',
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      routerLink: '/admin/settings',
    },
  ];
}
