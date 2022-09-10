import Konva from 'konva';
import { Node } from './node';
import { ItemFormOptions, ItemType } from './types';

export type CircleOptions = {
  id: string;
  text: string;
  height: number;
  width: number;
  rotation: number;
  x: number;
  y: number;
};

export class Circle extends Node {
  private options: CircleOptions;

  constructor(options: CircleOptions) {
    super({
      x: options.x,
      y: options.y,
      id: options.id,
      width: +options.width,
      height: +options.height,
      draggable: true,
      name: 'circle',
    });
    this.options = options;
    this.changeRotation(+options.rotation);
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
    this.width(+options.width);
    this.height(+options.height);
    this.changeRotation(+options.rotation);
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

  public override toObject(): CircleOptions & { type: ItemType } {
    return {
      id: this.id(),
      type: 'circle',
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

    const chairs = [];
    const totalPoints = 6;
    const r = this.options.height / 2;
    for (let i = 1; i <= totalPoints; i++) {
      const theta = (Math.PI * 2) / totalPoints;
      const angle = theta * i;

      chairs.push(
        new Konva.Circle({
          x: r * Math.cos(angle) + r,
          y: r * Math.sin(angle) + r,
          radius: 20,
          fill: 'green',
        })
      );
    }

    const circle = new Konva.Circle({
      width: +this.options.width,
      height: +this.options.height,
      x: +this.options.width / 2,
      y: +this.options.height / 2,
      fill: 'lightblue',
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

    this.add(...chairs, circle, name);
  }
}
