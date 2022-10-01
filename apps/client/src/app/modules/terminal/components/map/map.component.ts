import { AfterContentInit, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Node } from './nodes/node';
import { MapService } from './map.service';
import { IBill, ILocation, ITable } from '@pos/models';
import Konva from 'konva';
import { TableNode } from './nodes/table';
import { CircleNode } from './nodes/circle';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterContentInit, OnChanges {
  @Input() locations: Partial<ILocation>[] = [];
  @Input() tables: ITable[] = [];
  @Input() bills: IBill[] = [];

  @Output() selected = new EventEmitter<ITable>();

  private canvas!: Konva.Stage;
  private activeLayer?: Konva.Layer;

  public selectedItem?: Node;
  public selectedLocation?: Partial<ILocation>;

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
      const el = e.target.getParent();
      this.onSelect(el);
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
        const node = this.mapService.parseItems([
          { ...t, active: this.bills.some((b) => b.tableId === t.id), people: 0 },
        ]);
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

  onSelect(item: Node) {
    this.selectedItem = item;
    if (this.selectedItem instanceof TableNode || this.selectedItem instanceof CircleNode) {
      this.selected.emit(this.mapService.convertToItems([this.selectedItem])[0]);
    }
  }
}
