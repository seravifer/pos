import { Injectable } from '@angular/core';
import { Item } from '@pos/models';
import { v4 as uuid } from 'uuid';
import { Table } from './nodes/table';
import { Text } from './nodes/text';
import { Node } from './nodes/node';
import Konva from 'konva';
import { ItemType } from './nodes/types';

@Injectable({ providedIn: 'root' })
export class MapService {
  private itemTypes: { [key in ItemType]: typeof Konva.Group } = {
    table: Table,
    text: Text,
  };

  private defaultTypeItems: { [key in ItemType]: () => Konva.Group } = {
    table: () =>
      new Table({
        id: uuid(),
        text: '123',
        x: 100,
        y: 100,
      }),
    text: () =>
      new Text({
        id: uuid(),
        text: 'Your text!',
        x: 100,
        y: 100,
        rotation: 0,
      }),
  };

  createItem(type: ItemType) {
    return this.defaultTypeItems[type]();
  }

  convertToItems(items?: Konva.Layer['children']): Item[] {
    return items?.map((child) => {
      if (child instanceof Node) {
        const item = child.toObject();
        const { id, type, ...options } = item;
        return {
          id,
          type,
          options,
          locationId: null,
        };
      }
      return null;
    }) as Item[];
  }

  parseItems(items: Item[]) {
    return items.map((item) => {
      return new this.itemTypes[item.type as ItemType]({
        ...item,
        ...item.options,
      });
    });
  }
}
