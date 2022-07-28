import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { TablesService } from '@pos/client/services/tables.service';
import Konva from 'konva';
import { Table } from './items/table';
import { Text } from './items/text';

@Component({
  selector: 'pos-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterContentInit {
  private canvas!: Konva.Stage;
  private layer!: Konva.Layer;

  constructor(private tablesService: TablesService) {}

  ngOnInit(): void {
    this.tablesService.getTables().subscribe((data) => {});
  }

  addTable() {
    const newTable = new Table({
      id: 'table',
      x: 100,
      y: 100,
      text: '123',
    });
    this.layer.add(newTable);
  }

  addText() {
    const newText = new Text({
      id: 'text',
      text: 'Hello World',
      x: 100,
      y: 100,
    });
    this.layer.add(newText);
  }

  onSave() {
    this.layer.children?.forEach((child) => {
      if (child instanceof Table) {
        console.log(child.toObject());
      }
      if (child instanceof Text) {
        console.log(child.toObject());
      }
    });
  }

  ngAfterContentInit(): void {
    Konva.hitOnDragEnabled = true;
    this.canvas = new Konva.Stage({
      container: 'canvas',
      width: 500,
      height: 500,
      draggable: true,
    });
    this.layer = new Konva.Layer();
    this.canvas.add(this.layer);
    this.canvas.on('click', (e) => {
      // FIXME: refactor
      const el = e.target.getParent();
      const focusElement = this.layer.children?.find((node) => {
        if (node instanceof Text) {
          return node.hasFocus();
        }
        return false;
      });
      if (el != focusElement && focusElement instanceof Text) {
        focusElement.removeFocus();
        console.log(focusElement.toObject());
      }
    });
  }
}
