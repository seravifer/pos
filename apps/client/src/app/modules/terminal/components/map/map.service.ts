import { Injectable } from '@angular/core';
import { ITable } from '@pos/models';
import { v4 as uuid } from 'uuid';
import { TableNode } from './nodes/table';
import { TextNode } from './nodes/text';
import { Node } from './nodes/node';
import { CircleNode } from './nodes/circle';
import { ITableInfo, ItemType } from './types';
import Konva from 'konva';

@Injectable({ providedIn: 'root' })
export class MapService {
  private itemTypes: { [key in ItemType]: typeof Konva.Group } = {
    table: TableNode,
    text: TextNode,
    circle: CircleNode,
  };

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

  parseItems(items: ITableInfo[]) {
    return items.map((item) => {
      return new this.itemTypes[item.type as ItemType]({
        ...item,
        ...(item.options as any),
      });
    });
  }
}
