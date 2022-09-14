import { Component, OnInit } from '@angular/core';
import { LocationsService } from '@pos/client/services/locations.service';
import { TableService } from '@pos/client/services/table.service';
import { Table, Location } from '@pos/models';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'pos-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.scss'],
})
export class MapEditorComponent implements OnInit {
  public locations: Partial<Location>[] = [];
  public tables: Table[] = [];

  constructor(
    private tableService: TableService,
    private locationsService: LocationsService
  ) {}

  ngOnInit(): void {
    combineLatest({
      locations: this.locationsService.getLocations(),
      tables: this.tableService.getTables(),
    }).subscribe(({ locations, tables }) => {
      this.locations = locations;
      this.tables = tables;
    });
  }

  onCreateLocation(location: Partial<Location>) {
    this.locationsService.createLocation(location).subscribe();
  }

  onSave(tables: Table[]) {
    this.tableService.createOrUpdateTables(tables).subscribe();
  }
}
