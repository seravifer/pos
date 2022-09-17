import { Injectable } from '@angular/core';
import { Table as ITable } from '@pos/models';
import { v4 as uuid } from 'uuid';
import { Table } from './nodes/table';
import { Text } from './nodes/text';
import { Node } from './nodes/node';
import { Circle } from './nodes/circle';
import Konva from 'konva';
import { ItemType } from './types';

@Injectable({ providedIn: 'root' })
export class MapService {
  private itemTypes: { [key in ItemType]: typeof Konva.Group } = {
    table: Table,
    text: Text,
    circle: Circle,
  };

  private defaultTypeItems: { [key in ItemType]: () => Konva.Group } = {
    table: () =>
      new Table({
        id: uuid(),
        text: 'Mesa X',
        height: 100,
        width: 100,
        chairs: 4,
        rotation: 0,
        x: 100,
        y: 100,
      }),
    circle: () =>
      new Circle({
        id: uuid(),
        chairs: 4,
        text: 'Mesa X',
        height: 100,
        rotation: 0,
        x: 100,
        y: 100,
      }),
    text: () =>
      new Text({
        id: uuid(),
        text: 'Tu texto',
        x: 100,
        y: 100,
        rotation: 0,
      }),
  };

  createItem(type: ItemType) {
    return this.defaultTypeItems[type]();
  }

  convertToItems(items?: Konva.Layer['children'] | Konva.Group[]): ITable[] {
    return items?.map((child) => {
      if (child instanceof Node) {
        const item = child.toObject();
        const { id, type, ...options } = item;
        return {
          id,
          type,
          name: item.text,
          options,
          locationId: null,
        };
      }
      return null;
    }) as ITable[];
  }

  parseItems(items: ITable[]) {
    return items.map((item) => {
      return new this.itemTypes[item.type as ItemType]({
        ...item,
        ...(item.options as any),
      });
    });
  }
}
