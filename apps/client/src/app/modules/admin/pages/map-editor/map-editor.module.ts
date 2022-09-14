import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MapEditorComponent } from './map-editor.component';
import { MapModule } from '@pos/client/components/map/map.module';

const routes: Routes = [{ path: '', component: MapEditorComponent }];

@NgModule({
  declarations: [MapEditorComponent],
  imports: [CommonModule, RouterModule.forChild(routes), MapModule],
})
export class MapEditorModule {}
