import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    loadChildren: () =>
      import('./modules/onboarding/onboarding.module').then((m) => m.OnboardingModule),
  },
  {
    path: 'terminal',
    loadChildren: () => import('./modules/terminal/terminal.module').then((m) => m.TerminalModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
