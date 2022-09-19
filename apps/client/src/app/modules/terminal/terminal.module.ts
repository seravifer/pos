import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TerminalComponent } from './terminal.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { TablesComponent } from './components/tables/tables.component';
import { MapModule } from '@pos/client/components/map/map.module';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TimeComponent } from './components/time/time.component';
import { SelectPipe } from '@pos/client/pipes/select.pipe';
import { PeopleComponent } from './components/people/people.component';
import { CalculatorModule } from '@pos/client/components/calculator/calculator.module';
import { MenusComponent } from './components/menus/menus.component';

const routes: Routes = [{ path: '', component: TerminalComponent }];

@NgModule({
  declarations: [
    TerminalComponent,
    CheckoutComponent,
    TablesComponent,
    TimeComponent,
    PeopleComponent,
    MenusComponent,
  ],
  providers: [DialogService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SelectPipe,
    CalculatorModule,
    MapModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TabViewModule,
    InputTextModule,
    InputNumberModule,
    SelectButtonModule,
    DynamicDialogModule,
  ],
})
export class TerminalModule {}
