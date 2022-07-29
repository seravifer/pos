export type ItemType = 'table' | 'text';
export type ItemFormOptions = {
  key: string;
  value: unknown;
  type: 'text' | 'number' | 'boolean' | 'select';
  [key: string]: unknown;
};
