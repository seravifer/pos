import { AfterContentInit, Component, OnInit } from '@angular/core';
import { ItemsService } from '@pos/client/services/items.service';
import { Node } from './nodes/node';
import { MapService } from './map.service';
import Konva from 'konva';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemFormOptions, ItemType } from './nodes/types';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterContentInit {
  private canvas!: Konva.Stage;
  private activeLayer!: Konva.Layer;

  public deletedItems: string[] = [];
  public selectedItem?: Node;

  public form?: FormGroup;
  public formOptions?: ItemFormOptions[];

  constructor(
    private itemsService: ItemsService,
    private mapService: MapService
  ) {}

  ngOnInit(): void {
    this.itemsService.getItems().subscribe((data) => {
      if (data.length > 0) {
        this.activeLayer.add(...this.mapService.parseItems(data));
      }
    });
  }

  ngAfterContentInit(): void {
    Konva.hitOnDragEnabled = true;
    this.canvas = new Konva.Stage({
      container: 'canvas',
      width: 500,
      height: 500,
      draggable: false,
    });
    this.activeLayer = new Konva.Layer();
    this.canvas.add(this.activeLayer);
    this.canvas.on('click', (e) => {
      // FIXME: refactor
      const el = e.target.getParent();
      this.onSelect(el);
      const focusElement = this.activeLayer.children?.find((node) => {
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

  addItem(type: ItemType) {
    const node = this.mapService.createItem(type);
    this.activeLayer.add(node);
    this.onSelect(node as Node);
  }

  onDelete() {
    if (this.selectedItem) {
      this.deletedItems.push(this.selectedItem.toObject().id);
      this.selectedItem.destroy();
      this.selectedItem = undefined;
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
    const items = this.mapService.convertToItems(this.activeLayer.children);
    this.itemsService.createOrUpdateItems(items).subscribe();
    this.itemsService.deleteItems(this.deletedItems).subscribe();
  }
}
