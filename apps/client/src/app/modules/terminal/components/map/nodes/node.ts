import Konva from 'konva';
import { ItemFormOptions } from './types';

export abstract class Node extends Konva.Group {
  public abstract removeFocus(): void;
  public abstract hasFocus(): boolean;
  public abstract getEditOptions(): ItemFormOptions[];
  public abstract setEditOptions(options: any[]): void;
}
