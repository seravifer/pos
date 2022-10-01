import Konva from 'konva';
import { Node } from './node';
import { ItemType } from '../types';

export type CircleOptions = {
  id: string;
  text: string;
  height: number;
  chairs: number;
  rotation: number;
  x: number;
  y: number;
};

export class CircleNode extends Node {
  private options: CircleOptions;

  constructor(options: CircleOptions) {
    super({
      x: options.x,
      y: options.y,
      id: options.id,
      width: +options.height,
      height: +options.height,
      name: 'circle',
    });
    this.options = options;
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
      chairs: +this.options.chairs,
      rotation: +this.options.rotation,
      x: this.x(),
      y: this.y(),
    };
  }

  private render() {
    this.destroyChildren();

    const chairs = [];
    const totalPoints = this.options.chairs;
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
      width: +this.options.height,
      height: +this.options.height,
      x: +this.options.height / 2,
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
      width: +this.options.height,
      height: +this.options.height,
      verticalAlign: 'middle',
      align: 'center',
    });

    this.add(...chairs, circle, name);
  }
}
