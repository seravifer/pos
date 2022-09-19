import {
  Bill,
  Category,
  Product,
  Location,
  Menu,
  User,
  Table,
  Section,
  SectionProduct,
} from '@prisma/client';
import { Optional } from './helpers';

export type ID = { id: string };

// Table/Location
export type ITable = Table;
export type ILocation = Location;

// User
export type IUser = User;

// Menu
export type IMenu = Menu & { sections: IMenuSection[] };
export type INewMenu = {
  name: string;
  active: boolean;
  price: number;
  sections: IMenuSection[];
};

export type IMenuSection = {
  name: string;
  sectionId: string;
  maxProducts: number;
};

export type ISection = Section & {
  products: Product[];
};

export type ISectionProduct = SectionProduct;

// Bill
export type IBill = Bill & {
  products: IBillItem[];
};
export type INewBill = Partial<Bill>;

export type IBillItem = {
  id: string;
  name: string;
  productId: string;
  price: number;
  quantity: number;
};

// Products
export type ICategory = Category & {
  products: Product[];
};

export type IProduct = Product;
export type INewProduct = Optional<
  Omit<IProduct, 'createdAt' | 'updatedAt'>,
  'id'
>;
