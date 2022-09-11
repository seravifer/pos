import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TerminalComponent } from './terminal.component';
import { MapComponent } from './components/map/map.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalculatorComponent } from './components/calculator/calculator.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

const routes: Routes = [
  { path: '', component: TerminalComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  declarations: [
    TerminalComponent,
    MapComponent,
    CalculatorComponent,
    CheckoutComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TabViewModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectButtonModule,
  ],
})
export class TerminalModule {}
