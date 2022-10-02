import Konva from 'konva';
import { Node } from './node';

export type TableOptions = {
  id: string;
  text: string;
  height: number;
  width: number;
  chairs: number;
  rotation: number;
  active: boolean;
  x: number;
  y: number;
};

export class TableNode extends Node {
  private options: TableOptions;

  constructor(options: TableOptions) {
    super({
      id: options.id,
      x: options.x,
      y: options.y,
      width: +options.width,
      height: +options.height,
    });
    this.options = options;
    this.render();
  }

  public changeRotation(el: any, rotation: number) {
    const degToRad = Math.PI / 180;

    const rotatePoint = ({ x, y }: { x: number; y: number }, deg: number) => {
      const rcos = Math.cos(deg * degToRad);
      const rsin = Math.sin(deg * degToRad);
      return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
    };

    const topLeft = { x: -el.width() / 2, y: -el.height() / 2 };
    const current = rotatePoint(topLeft, el.rotation());
    const rotated = rotatePoint(topLeft, rotation);
    const dx = rotated.x - current.x;
    const dy = rotated.y - current.y;

    el.rotation(rotation);
    el.x(el.x() + dx);
    el.y(el.y() + dy);
  }

  public override toObject() {
    return {
      id: this.id(),
      type: 'table',
      text: this.options.text,
      height: +this.options.height,
      width: +this.options.width,
      chairs: +this.options.chairs,
      rotation: +this.options.rotation,
      x: this.x(),
      y: this.y(),
    };
  }

  private render() {
    const { height, width } = this.options;

    this.destroyChildren();
    this.width(+width);
    this.height(+height);
    this.changeRotation(this, this.options.rotation);

    // Distribution of chairs
    const totalChairs = +this.options.chairs;
    const mod = totalChairs % 4;
    const val = (totalChairs - mod) / 4;
    const side = Array(4).fill(val); // [top, bottom, right, left]
    for (let i = 0; i < mod; i++) {
      side[i] = side[i] + 1;
    }

    const round = (value: number, precision: number) => {
      const multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    };

    const calcPos = (pos: number, items: number, distance: number) => {
      let a = (pos + 1) / (items + 1); // Split the space into equal parts
      a = round(a, 2); // round first decimal
      return a * distance;
    };

    const chairs = [];
    // top
    for (let i = 0; i < side[0]; i++) {
      chairs.push(
        new Konva.Rect({
          x: calcPos(i, side[0], +width) - 20,
          y: -28,
          fill: this.options.active ? '#40c166' : '#dadee4',
          cornerRadius: [40, 40, 4, 4],
          height: 20,
          width: 40,
        })
      );
    }
    // bottom
    for (let i = 0; i < side[1]; i++) {
      chairs.push(
        new Konva.Rect({
          x: calcPos(i, side[1], +width) + 20,
          y: +height + 28,
          fill: this.options.active ? '#40c166' : '#dadee4',
          cornerRadius: [40, 40, 4, 4],
          height: 20,
          width: 40,
          rotation: 180,
        })
      );
    }
    // right
    for (let i = 0; i < side[2]; i++) {
      chairs.push(
        new Konva.Rect({
          x: +width + 28,
          y: calcPos(i, side[2], +height) - 20,
          fill: this.options.active ? '#40c166' : '#dadee4',
          cornerRadius: [40, 40, 4, 4],
          height: 20,
          width: 40,
          rotation: 90,
        })
      );
    }
    // left
    for (let i = 0; i < side[3]; i++) {
      chairs.push(
        new Konva.Rect({
          x: -28,
          y: calcPos(i, side[3], +height) + 20,
          fill: this.options.active ? '#40c166' : '#dadee4',
          cornerRadius: [40, 40, 4, 4],
          height: 20,
          width: 40,
          rotation: 270,
        })
      );
    }

    const table = new Konva.Rect({
      width: +width,
      height: +height,
      fill: 'white',
      stroke: '#40c166',
      strokeWidth: this.options.active ? 6 : 0,
      cornerRadius: 6,
      shadowColor: 'black',
      shadowBlur: 8,
      shadowOpacity: 0.2,
    });
    const name = new Konva.Text({
      text: this.options.text,
      fontSize: 22,
      fontFamily: 'Calibri',
      fill: '#000',
      width: +width,
      height: +height,
      verticalAlign: 'middle',
      align: 'center',
    });

    this.add(...chairs, table, name);
  }
}
