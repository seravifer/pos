import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { NumberPadModule } from '@pos/client/components/number-pad/number-pad.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [{ path: '', component: OnboardingComponent }];

@NgModule({
  declarations: [OnboardingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NumberPadModule,
    FormsModule,
    ButtonModule,
  ],
})
export class OnboardingModule {}
