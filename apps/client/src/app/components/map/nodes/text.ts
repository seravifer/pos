import Konva from 'konva';
import { Node } from './node';
import { ItemFormOptions, ItemType } from '../types';

export type TextOptions = {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
};

export class Text extends Node {
  private options: TextOptions;

  constructor(options: TextOptions) {
    super({
      x: options.x,
      y: options.y,
      id: options.id,
      draggable: true,
    });
    this.options = options;
    this.render();
  }

  public removeFocus() {
    (this.findOne('Transformer') as Konva.Transformer).hide();
  }

  public hasFocus() {
    return (this.findOne('Transformer') as Konva.Transformer).visible();
  }

  public getEditOptions(): ItemFormOptions[] {
    return [
      {
        key: 'text',
        value: this.options.text,
        type: 'text',
        name: 'Texto',
      },
    ];
  }

  public setEditOptions(options: any): void {
    this.options = { ...this.options, ...options };
    (this.findOne('Text') as Konva.Text)?.text(options.text);
  }

  public override toObject(): TextOptions & { type: ItemType } {
    return {
      id: this.id(),
      type: 'text',
      text: (this.findOne('Text') as Konva.Text)?.text(),
      x: this.x(),
      y: this.y(),
      rotation: (this.findOne('Text') as Konva.Text).rotation(),
    };
  }

  private render() {
    const textNode = new Konva.Text({
      text: this.options.text,
      rotation: this.options.rotation,
      fontSize: 20,
      width: 200,
    });

    const tr = new Konva.Transformer({
      nodes: [textNode],
      visible: false,
      enabledAnchors: ['middle-left', 'middle-right'],
      // set minimum width of text
      boundBoxFunc: (_, newBox) => {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
    });

    this.add(textNode, tr);

    textNode.on('transform', () => {
      // reset scale, so only with is changing by transformer
      textNode.setAttrs({
        width: textNode.width() * textNode.scaleX(),
        scaleX: 1,
      });
    });

    textNode.on('click', () => {
      tr.show();
    });
  }
}
