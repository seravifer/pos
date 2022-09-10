import Konva from 'konva';
import { Node } from './node';
import { ItemFormOptions, ItemType } from './types';

export type TableOptions = {
  id: string;
  text: string;
  height: number;
  width: number;
  rotation: number;
  x: number;
  y: number;
};

export class Table extends Node {
  private options: TableOptions;

  constructor(options: TableOptions) {
    super({
      id: options.id,
      x: options.x,
      y: options.y,
      width: +options.width,
      height: +options.height,
      draggable: true,
    });
    this.options = options;
    this.render();
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
      {
        key: 'height',
        value: +this.options.height,
        type: 'number',
      },
      {
        key: 'width',
        value: +this.options.width,
        type: 'number',
      },
      {
        key: 'rotation',
        value: +this.options.rotation,
        type: 'number',
      },
    ];
  }

  public setEditOptions(options: any): void {
    this.options = { ...this.options, ...options };
    this.render();
  }

  public changeRotation(rotation: number) {
    const degToRad = Math.PI / 180;

    const rotatePoint = ({ x, y }: { x: number; y: number }, deg: number) => {
      const rcos = Math.cos(deg * degToRad);
      const rsin = Math.sin(deg * degToRad);
      return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
    };

    const topLeft = { x: -this.width() / 2, y: -this.height() / 2 };
    const current = rotatePoint(topLeft, this.rotation());
    const rotated = rotatePoint(topLeft, rotation);
    const dx = rotated.x - current.x;
    const dy = rotated.y - current.y;

    this.rotation(rotation);
    this.x(this.x() + dx);
    this.y(this.y() + dy);
  }

  public override toObject(): TableOptions & { type: ItemType } {
    return {
      id: this.id(),
      type: 'table',
      text: this.options.text,
      height: +this.options.height,
      width: +this.options.width,
      rotation: +this.options.rotation,
      x: this.x(),
      y: this.y(),
    };
  }

  private render() {
    this.destroyChildren();
    this.width(+this.options.width);
    this.height(+this.options.height);
    this.changeRotation(+this.options.rotation);

    const chairs = [
      new Konva.Circle({
        x: 0,
        y: +this.options.height / 2,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: +this.options.width,
        y: +this.options.height / 2,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: +this.options.width / 2,
        y: +this.options.height,
        radius: 20,
        fill: 'green',
      }),
      new Konva.Circle({
        x: +this.options.width / 2,
        y: 0,
        radius: 20,
        fill: 'green',
      }),
    ];
    const table = new Konva.Rect({
      width: +this.options.width,
      height: +this.options.height,
      fill: 'lightblue',
      cornerRadius: 6,
      stroke: 'white',
      strokeWidth: 2,
    });
    const name = new Konva.Text({
      text: this.options.text,
      fontSize: 22,
      fontFamily: 'Calibri',
      fill: '#000',
      width: +this.options.width,
      height: +this.options.height,
      verticalAlign: 'middle',
      align: 'center',
    });

    this.add(...chairs, table, name);
  }
}
