import { AfterContentInit, Component, OnInit } from '@angular/core';
import { TableService } from '@pos/client/services/table.service';
import { Node } from './nodes/node';
import { MapService } from './map.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemFormOptions, ItemType } from './nodes/types';
import { LocationsService } from '@pos/client/services/locations.service';
import { v4 as uuid } from 'uuid';
import { Location } from '@pos/models';
import { combineLatest } from 'rxjs';
import Konva from 'konva';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterContentInit {
  private canvas!: Konva.Stage;
  private activeLayer?: Konva.Layer;
  private layers: Konva.Layer[] = [];
  public locations: Location[] = [];

  public deletedItems: string[] = [];
  public selectedItem?: Node;

  public form?: FormGroup;
  public formOptions?: ItemFormOptions[];

  constructor(
    private tableService: TableService,
    private locationsService: LocationsService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    combineLatest({
      locations: this.locationsService.getLocations(),
      tables: this.tableService.getTables(),
    }).subscribe(({ locations, tables }) => {
      this.locations = locations;
      this.layers = locations.map(
        (l) => new Konva.Layer({ visible: false, id: l.id })
      );
      this.layers.forEach((l) => this.canvas.add(l));
      this.activeLayer = this.layers[0];
      this.activeLayer.show();

      tables.forEach((t) => {
        const node = this.mapService.parseItems([t]);
        const layer = this.layers.find((l) => l.id() === t.locationId);
        layer?.add(...node);
      });
    });
  }

  ngAfterContentInit(): void {
    Konva.hitOnDragEnabled = true;
    this.canvas = new Konva.Stage({
      container: 'canvas',
      width: 1000,
      height: 1000,
      draggable: false,
    });
    this.canvas.on('click', (e) => {
      // FIXME: refactor
      const el = e.target.getParent();
      this.onSelect(el);
      const focusElement = this.activeLayer?.children?.find((node) => {
        if (node instanceof Node) {
          return node.hasFocus();
        }
        return false;
      });
      if (el != focusElement && focusElement instanceof Node) {
        focusElement.removeFocus();
      }
    });
  }

  onChangeFloor(id: string) {
    this.activeLayer?.hide();
    this.activeLayer = this.layers.find((l) => l.id() === id);
    this.activeLayer?.show();
  }

  onCreateFloor() {
    const newLocation = { id: uuid(), name: 'test' };
    this.locations.push(newLocation);
    this.layers.push(new Konva.Layer({ visible: false, id: newLocation.id }));
    this.onChangeFloor(newLocation.id);
    this.locationsService.createLocation(newLocation).subscribe();
  }

  onDeleteFloor() {
    // TODO
  }

  addItem(type: ItemType) {
    const node = this.mapService.createItem(type);
    this.activeLayer?.add(node);
    this.onSelect(node as Node);
  }

  onDelete() {
    if (this.selectedItem) {
      this.deletedItems.push(this.selectedItem.toObject().id);
      this.selectedItem.destroy();
      this.onSelect();
    }
  }

  onSelect(item?: Node) {
    this.selectedItem = item;
    this.formOptions = undefined;
    this.form = undefined;
    if (this.selectedItem) {
      this.form = new FormGroup({});
      this.formOptions = this.selectedItem.getEditOptions();
      this.formOptions.forEach((el) => {
        this.form?.addControl(el.key, new FormControl(el.value));
      });
      this.form.valueChanges.subscribe((data) => {
        this.selectedItem?.setEditOptions(data);
      });
    }
  }

  onSave() {
    const items = this.layers.flatMap((l) =>
      this.mapService
        .convertToItems(l.children)
        .map((t) => ({ ...t, locationId: l.id() }))
    );

    this.tableService.createOrUpdateTables(items).subscribe();
    this.tableService.deleteTables(this.deletedItems).subscribe();
  }
}
