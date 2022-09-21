import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./pages/categories/categories.module').then((m) => m.CategoriesModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/products.module').then((m) => m.ProductsModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./pages/settings/settings.module').then((m) => m.SettingsModule),
      },
      {
        path: 'menu',
        loadChildren: () => import('./pages/menu/menu.module').then((m) => m.MenuModule),
      },
      {
        path: 'map-editor',
        loadChildren: () =>
          import('./pages/map-editor/map-editor.module').then((m) => m.MapEditorModule),
      },
    ],
  },
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ButtonModule],
})
export class AdminModule {}
