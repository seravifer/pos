import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TerminalComponent } from './terminal.component';
import { MapComponent } from './map/map.component';
import { ButtonModule } from 'primeng/button';

const routes: Routes = [
  { path: '', component: TerminalComponent },
  { path: 'map', component: MapComponent },
];

@NgModule({
  declarations: [TerminalComponent, MapComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ButtonModule],
})
export class TerminalModule {}
