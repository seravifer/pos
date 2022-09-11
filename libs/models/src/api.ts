export type Bill = {
  id: string;
  tableId: string | null;
  people: number | null;
  total: number | null;
  paid: number | null;
  closedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BillWithProducts = Bill & {
  products: BProduct[];
};

export type BProduct = {
  id: string;
  name: string;
  productId: string;
  price: number;
  quantity: number;
};

export type BillProduct = {
  id: string;
  billId: string | null;
  productId: string | null;
  price: number | null;
  quantity: number | null;
};

export type Category = {
  id: string;
  name: string;
  color: string | null;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  cost: number | null;
  tax: number | null;
  stock: number | null;
  image: string | null;
  categoryId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type Table = {
  id: string;
  name: string;
  size: number;
  type: string;
  options: any;
  locationId: string | null;
};

export type User = {
  id: string;
  name: string | null;
  username: string | null;
  password: string | null;
  role: string | null;
};

export type Location = {
  id: string;
  name: string;
};
