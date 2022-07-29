import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TerminalComponent } from './terminal.component';
import { MapComponent } from './components/map/map.component';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: TerminalComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  declarations: [TerminalComponent, MapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TabViewModule,
  ],
})
export class TerminalModule {}
