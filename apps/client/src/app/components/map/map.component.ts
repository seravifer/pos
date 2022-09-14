import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Node } from './nodes/node';
import { MapService } from './map.service';
import { Location, Table } from '@pos/models';
import { v4 as uuid } from 'uuid';
import { ItemFormOptions, ItemType } from './types';
import { FormGroup, FormControl } from '@angular/forms';
import Konva from 'konva';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterContentInit, OnChanges {
  @Input() locations: Partial<Location>[] = [];
  @Input() tables: Table[] = [];

  @Output() selected = new EventEmitter<Table>();
  @Output() save = new EventEmitter<Table[]>();
  @Output() createLocation = new EventEmitter<Partial<Location>>();

  private canvas!: Konva.Stage;
  private activeLayer?: Konva.Layer;
  private layers: Konva.Layer[] = [];

  public selectedItem?: Node;

  public form?: FormGroup;
  public formOptions?: ItemFormOptions[];

  constructor(private mapService: MapService) {}

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

  ngOnChanges() {
    if (this.locations.length > 0 && this.tables && this.canvas) {
      this.layers = this.locations.map(
        (l) => new Konva.Layer({ visible: false, id: l.id })
      );
      this.layers.forEach((l) => this.canvas.add(l));
      this.activeLayer = this.layers[0];
      this.activeLayer.show();

      this.tables.forEach((t) => {
        const node = this.mapService.parseItems([t]);
        const layer = this.layers.find((l) => l.id() === t.locationId);
        layer?.add(...node);
      });
    }
  }

  onChangeLocation(id: string) {
    this.activeLayer?.hide();
    this.activeLayer = this.layers.find((l) => l.id() === id);
    this.activeLayer?.show();
  }

  onCreateLocation() {
    const newLocation = { id: uuid(), name: 'test' };
    this.locations.push(newLocation);
    this.layers.push(new Konva.Layer({ visible: false, id: newLocation.id }));
    this.onChangeLocation(newLocation.id);
    this.createLocation.emit(newLocation);
  }

  onDeleteLocation() {
    // TODO
  }

  addItem(type: ItemType) {
    const node = this.mapService.createItem(type);
    this.activeLayer?.add(node);
    this.onSelect(node as Node);
  }

  onDelete() {
    if (this.selectedItem) {
      this.selectedItem.destroy();
      this.onSelect();
    }
  }

  onSelect(item?: Node) {
    this.selectedItem = item;
    this.formOptions = undefined;
    this.form = undefined;
    if (this.selectedItem) {
      this.selected.emit(
        this.mapService.convertToItems([this.selectedItem])[0]
      );
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
    const tables = this.layers.flatMap((l) =>
      this.mapService
        .convertToItems(l.children)
        .map((t) => ({ ...t, locationId: l.id() }))
    );
    this.save.emit(tables);
  }
}
