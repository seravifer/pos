export type Bill = {
  id: string;
  tableId: number | null;
  people: number | null;
  total: number | null;
  paid: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export type BillWithProducts = Bill & {
  products: BProduct[];
};

export type BProduct = {
  id: string;
  name: string;
  productId: number;
  price: number;
  quantity: number;
};

export type BillProduct = {
  id: string;
  billId: number | null;
  productId: number | null;
  price: number | null;
  quantity: number | null;
};

export type Category = {
  id: number;
  name: string;
  color: string | null;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};

export type Product = {
  id: number;
  name: string;
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

export type Item = {
  id: string;
  type: string;
  options: any | null;
  locationId: number | null;
};

export type Location = {
  id: number;
  name: string;
};
