import Konva from 'konva';

export type TableOptions = {
  id: string;
  text: string;
  x: number;
  y: number;
};

export class Table extends Konva.Group {
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

  public removeFocus() {}

  public hasFocus() {
    return false;
  }

  public override toObject(): TableOptions {
    return {
      id: this.id(),
      text: (this.findOne('Text') as Konva.Text).text(),
      x: this.x(),
      y: this.y(),
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

    this.toObject = () => ({
      x: this.x(),
      y: this.y(),
      id: this.id(),
      text: name.text(),
    });
    this.add(...shape, name);
  }
}
