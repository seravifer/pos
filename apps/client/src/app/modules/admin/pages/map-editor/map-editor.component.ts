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

  onSave({
    tables,
    locations,
  }: {
    tables: Table[];
    locations: Partial<Location>[];
  }) {
    this.tableService.createOrUpdateTables(tables).subscribe();
    locations.forEach((location, position) => {
      this.locationsService
        .updateLocation({ ...location, position })
        .subscribe();
    });
    this.locations
      .filter((l) => !locations.find((l2) => l2.id === l.id))
      .forEach((l) => {
        this.locationsService.deleteLocation(l.id as string).subscribe();
      });
  }
}
