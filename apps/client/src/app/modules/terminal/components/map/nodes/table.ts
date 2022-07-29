import Konva from 'konva';
import { Node } from './node';
import { ItemFormOptions, ItemType } from './types';

export type TableOptions = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export class Table extends Node {
  private options: TableOptions;

  constructor(options: TableOptions) {
    super({
      x: options.x,
      y: options.y,
      id: options.id,
      width: 100,
      height: 100,
      draggable: true,
      name: 'table',
    });
    this.options = options;
    this.init();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public removeFocus() {}

  public hasFocus() {
    return false;
  }

  public getEditOptions(): ItemFormOptions[] {
    return [
      {
        key: 'text',
        value: this.options.text,
        type: 'text',
      },
    ];
  }

  public setEditOptions(options: any): void {
    const textNode = this.findOne('Text') as Konva.Text;
    textNode.text(options.text);
    this.options.text = options.text;
  }

  public override toObject(): TableOptions & { type: ItemType } {
    return {
      id: this.id(),
      text: (this.findOne('Text') as Konva.Text).text(),
      x: this.x(),
      y: this.y(),
      type: 'table',
    };
  }

  private init() {
    const shape = [
      new Konva.Circle({
        x: 0,
        y: 50,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: 100,
        y: 50,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: 50,
        y: 100,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: 50,
        y: 0,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Rect({
        width: 100,
        height: 100,
        fill: 'lightblue',
        cornerRadius: 6,
        stroke: 'white',
        strokeWidth: 2,
      }),
    ];
    const name = new Konva.Text({
      text: this.options.text,
      fontSize: 22,
      fontFamily: 'Calibri',
      fill: '#000',
      width: 100,
      height: 100,
      verticalAlign: 'middle',
      align: 'center',
    });

    this.add(...shape, name);
  }
}
