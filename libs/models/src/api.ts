import {
  Bill,
  Category,
  Product,
  BillProduct,
  Location,
  Menu,
  MenuSection,
  User,
  Table,
  Section,
  SectionProduct,
} from '@prisma/client';

export {
  Bill,
  Category,
  Product,
  BillProduct,
  Location,
  Menu,
  MenuSection,
  Table,
  User,
  Section,
  SectionProduct,
};

export type ID = { id: string };

export type BillWithProducts = Bill & {
  products: IBillProduct[];
};

export type IBillProduct = {
  id: string;
  name: string;
  productId: string;
  price: number;
  quantity: number;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};
