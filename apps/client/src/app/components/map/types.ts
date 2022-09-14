export type ItemType = 'table' | 'text' | 'circle';
export type ItemFormOptions = {
  key: string;
  value: unknown;
  type: 'text' | 'number' | 'boolean' | 'select';
  [key: string]: any;
};
