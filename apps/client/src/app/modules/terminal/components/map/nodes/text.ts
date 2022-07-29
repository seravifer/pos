import Konva from 'konva';
import { Node } from './node';
import { ItemType } from './types';

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
    this.init();
  }

  public removeFocus() {
    (this.findOne('Transformer') as Konva.Transformer).hide();
  }

  public hasFocus() {
    return (this.findOne('Transformer') as Konva.Transformer).visible();
  }

  public getEditOptions(): any[] {
    return [];
  }

  public setEditOptions(options: any[]): void {
    // eslint-disable-next-line no-console
    console.log(options);
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

  private init() {
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
      boundBoxFunc: function (oldBox, newBox) {
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

    textNode.on('dblclick dbltap', () => {
      console.log(this.parent);
      // hide text node and transformer:
      textNode.hide();
      tr.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      const textPosition = textNode.absolutePosition();

      // If the element can be clicked, Stage exists
      const stage = this.getStage() as Konva.Stage;

      // so position of textarea will be the sum of positions above:
      const areaPosition = {
        x: stage.container().offsetLeft + textPosition.x,
        y: stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = textNode.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
      textarea.style.height =
        textNode.height() - textNode.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = textNode.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = textNode.lineHeight().toString();
      textarea.style.fontFamily = textNode.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = textNode.align();
      textarea.style.color = textNode.fill();
      const rotation = textNode.rotation();
      if (rotation) {
        textarea.style.transform = 'rotateZ(' + rotation + 'deg)';
      }

      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode?.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        textNode.show();
        tr.show();
        tr.forceUpdate();
      }

      function setTextareaWidth(newWidth: number) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = 1 * textNode.fontSize();
        }

        textarea.style.width = newWidth + 'px';
      }

      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.key === 'Enter' && !e.shiftKey) {
          textNode.text(textarea.value);
          removeTextarea();
        }
        // on esc do not set value back to node
        if (e.key === 'Escape') {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', function (e) {
        const scale = textNode.getAbsoluteScale().x;
        setTextareaWidth(textNode.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + textNode.fontSize() + 'px';
      });

      function handleOutsideClick(e: MouseEvent) {
        if (e.target !== textarea) {
          textNode.text(textarea.value);
          removeTextarea();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick, { once: true });
      });
    });
  }
}
