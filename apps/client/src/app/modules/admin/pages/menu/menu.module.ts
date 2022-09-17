import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { SectionsComponent } from './sections/sections.component';
import { PickListModule } from 'primeng/picklist';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupComponent } from './group/group.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { FilterListPipe } from './sections/filter-list.pipe';
import { TagModule } from 'primeng/tag';

const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'section', component: SectionsComponent },
  { path: 'section/:id', component: SectionsComponent },
  { path: 'group', component: GroupComponent },
  { path: 'group/:id', component: GroupComponent },
];

@NgModule({
  declarations: [
    MenuComponent,
    SectionsComponent,
    GroupComponent,
    FilterListPipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PickListModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    CheckboxModule,
    TagModule,
  ],
})
export class MenuModule {}
