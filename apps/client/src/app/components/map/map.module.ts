import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

import { MapComponent } from './map.component';

@NgModule({
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  exports: [MapComponent],
  declarations: [MapComponent],
  providers: [],
})
export class MapModule {}
