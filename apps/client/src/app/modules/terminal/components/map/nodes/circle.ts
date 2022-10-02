import Konva from 'konva';
import { Node } from './node';

export type CircleOptions = {
  id: string;
  text: string;
  height: number;
  chairs: number;
  rotation: number;
  active: boolean;
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

  public override toObject() {
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

    const { height, active } = this.options;

    const chairs = [];
    const totalPoints = this.options.chairs;
    const r = height / 2;
    for (let i = 1; i <= totalPoints; i++) {
      const theta = (Math.PI * 2) / totalPoints;
      const angle = theta * i;
      const rotation = angle * (180 / Math.PI) - 270;

      chairs.push(
        new Konva.Rect({
          x: r * Math.cos(angle) + r,
          y: r * Math.sin(angle) + r,
          fill: this.options.active ? '#40c166' : '#dadee4',
          cornerRadius: [40, 40, 4, 4],
          offset: { x: 20, y: 26 },
          rotation,
          height: 20,
          width: 40,
        })
      );
    }

    const circle = new Konva.Circle({
      width: +height,
      height: +height,
      x: +height / 2,
      y: +height / 2,
      fill: 'white',
      stroke: '#40c166',
      strokeWidth: active ? 6 : 0,
      shadowColor: 'black',
      shadowBlur: 8,
      shadowOpacity: 0.2,
    });
    const name = new Konva.Text({
      text: this.options.text,
      fontSize: 22,
      fontFamily: 'Calibri',
      fill: '#000',
      width: +height,
      height: +height,
      verticalAlign: 'middle',
      align: 'center',
    });

    this.add(circle, ...chairs, name);
  }
}
