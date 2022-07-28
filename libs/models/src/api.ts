export type Bill = {
  id: number;
  tableId: number | null;
  people: number | null;
  total: number | null;
  paid: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type BillProduct = {
  id: number;
  bilId: number | null;
  productId: number | null;
  price: number | null;
  quantity: number | null;
};

export type Category = {
  id: number;
  name: string | null;
};

export type Product = {
  id: number;
  name: string | null;
  description: string | null;
  price: number | null;
  cost: number | null;
  tax: number | null;
  stock: number | null;
  image: string | null;
  categoryId: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ProductReq = Pick<
  Product,
  | 'name'
  | 'description'
  | 'price'
  | 'cost'
  | 'tax'
  | 'stock'
  | 'image'
  | 'categoryId'
>;

export type Table = {
  id: number;
  name: string | null;
  size: number | null;
};

export type User = {
  id: number;
  name: string | null;
  username: string | null;
  password: string | null;
  role: string | null;
};
