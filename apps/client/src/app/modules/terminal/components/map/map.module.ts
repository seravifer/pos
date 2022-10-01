import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { MapComponent } from './map.component';
import { ConfirmationService } from 'primeng/api';
import { OrderListModule } from 'primeng/orderlist';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    ConfirmPopupModule,
    OrderListModule,
  ],
  exports: [MapComponent],
  declarations: [MapComponent],
  providers: [ConfirmationService],
})
export class MapViewModule {}
