import { ITable } from '@pos/models';

export type ItemType = 'table' | 'text' | 'circle';
export type ItemFormOptions = {
  key: string;
  value: unknown;
  type: 'text' | 'number' | 'boolean' | 'select';
  [key: string]: any;
};

export type ITableInfo = ITable & {
  active: boolean;
  people: number;
};
