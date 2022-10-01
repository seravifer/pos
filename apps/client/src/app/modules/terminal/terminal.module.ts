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
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TimeComponent } from './components/time/time.component';
import { SelectPipe } from '@pos/client/pipes/select.pipe';
import { PeopleComponent } from './components/people/people.component';
import { NumberPadModule } from '@pos/client/components/number-pad/number-pad.module';
import { MenusComponent } from './components/menus/menus.component';
import { TotalPricePipe } from './components/menu-price.pipe';
import { TicketsComponent } from './components/tickets/tickets.component';
import { MapViewModule } from './components/map/map.module';

const routes: Routes = [{ path: '', component: TerminalComponent }];

@NgModule({
  declarations: [
    TerminalComponent,
    CheckoutComponent,
    TimeComponent,
    PeopleComponent,
    MenusComponent,
    TotalPricePipe,
    TicketsComponent,
  ],
  providers: [DialogService],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SelectPipe,
    NumberPadModule,
    MapViewModule,
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
