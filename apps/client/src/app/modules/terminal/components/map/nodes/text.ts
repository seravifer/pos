import Konva from 'konva';
import { Node } from './node';

export type TextOptions = {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
};

export class TextNode extends Node {
  private options: TextOptions;

  constructor(options: TextOptions) {
    super({
      x: options.x,
      y: options.y,
      id: options.id,
    });
    this.options = options;
    this.render();
  }

  private render() {
    const textNode = new Konva.Text({
      text: this.options.text,
      rotation: this.options.rotation,
      fontSize: 20,
      width: 200,
    });

    this.add(textNode);
  }
}
