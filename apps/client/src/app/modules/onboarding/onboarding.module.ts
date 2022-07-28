import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';


const routes: Routes = [
  { path: '', component: OnboardingComponent }
];

@NgModule({
  declarations: [
    OnboardingComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OnboardingModule { }
