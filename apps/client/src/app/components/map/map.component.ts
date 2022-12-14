import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Node } from './nodes/node';
import { MapService } from './map.service';
import { ILocation, ITable } from '@pos/models';
import { v4 as uuid } from 'uuid';
import { ItemFormOptions, ItemType } from './types';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { TableNode } from './nodes/table';
import { CircleNode } from './nodes/circle';
import Konva from 'konva';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterContentInit, OnChanges {
  @Input() locations: Partial<ILocation>[] = [];
  @Input() tables: ITable[] = [];
  @Input() editorMode = false;

  @Output() selected = new EventEmitter<ITable>();
  @Output() save = new EventEmitter<{
    tables: ITable[];
    locations: Partial<ILocation>[];
  }>();

  private canvas!: Konva.Stage;
  private activeLayer?: Konva.Layer;

  public selectedItem?: Node;
  public selectedLocation?: Partial<ILocation>;

  public form?: FormGroup;
  public formOptions?: ItemFormOptions[];

  constructor(private mapService: MapService, private confirmationService: ConfirmationService) {}

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
    this.load();
  }

  ngOnChanges() {
    this.load();
  }

  private load() {
    if (this.locations.length > 0 && this.tables && this.canvas) {
      this.locations.forEach((l) => this.canvas.add(new Konva.Layer({ visible: false, id: l.id })));
      this.changeLocation(this.locations[0]);

      this.tables.forEach((t) => {
        const node = this.mapService.parseItems([t]);
        const layer = this.canvas.getLayers().find((l) => l.id() === t.locationId);
        layer?.add(...node);
      });
    }
  }

  changeLocation(location: Partial<ILocation>) {
    this.activeLayer?.hide();
    this.activeLayer = this.canvas.getLayers().find((l) => l.id() === location.id);
    this.activeLayer?.show();
    this.selectedLocation = location;
  }

  createLocation() {
    const newLocation = { id: uuid(), name: 'Nueva localizaci??n' };
    this.locations.push(newLocation);
    this.canvas.add(new Konva.Layer({ visible: false, id: newLocation.id }));
    this.changeLocation(newLocation);
  }

  deleteLocation(event: Event) {
    this.confirmationService.confirm({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      target: event.target!,
      message: '??Estas seguro que quieres eliminar esta localizaci??n?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.locations = this.locations.filter((l) => l.id !== this.selectedLocation?.id);
        this.activeLayer?.destroy();
        this.changeLocation(this.locations[0]);
      },
    });
  }

  orderLocation(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.locations, event.previousIndex, event.currentIndex);
  }

  addItem(type: ItemType) {
    if (!this.activeLayer) return;
    const node = this.mapService.createItem(type);
    this.activeLayer.add(node);
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
      this.form = new FormGroup({});
      this.formOptions = this.selectedItem.getEditOptions();
      this.formOptions.forEach((el) => {
        this.form?.addControl(el.key, new FormControl(el.value));
      });
      this.form.valueChanges.subscribe((data) => {
        this.selectedItem?.setEditOptions(data);
      });
      if (this.selectedItem instanceof TableNode || this.selectedItem instanceof CircleNode) {
        this.selected.emit(this.mapService.convertToItems([this.selectedItem])[0]);
      }
    }
  }

  onSave() {
    const tables = this.canvas
      .getLayers()
      .flatMap((l) =>
        this.mapService.convertToItems(l.children).map((t) => ({ ...t, locationId: l.id() }))
      );
    this.save.emit({ tables, locations: this.locations });
  }
}
