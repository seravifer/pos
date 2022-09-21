import { Bill, Category, Product, Location, Menu, User, Table, Section } from '@prisma/client';
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
  id: string;
  name: string;
  sectionId: string;
  maxProducts: number;
  products: ISectionProduct[];
};

export type ISection = Section & {
  products: ISectionProduct[];
};

export type ISectionProduct = IProduct & { supplement: number };

// Bill
export type IBill = Bill & {
  billItems: IBillItem[];
};
export type INewBill = Partial<Bill>;

export type IBillItem = {
  id: string;

  billId: string;

  productId: string | null;
  menuId: string | null;

  name: string;
  price: number;
  quantity: number;
  note: string | null;
  sections?: {
    id: string;
    section: {
      id: string;
      name: string;
    };
    products: {
      id: string;
      name: string;
      supplement: number;
    }[];
  }[];

  createdAt: Date;
  updatedAt: Date;
};
export type INewBillProduct = Omit<IBillItem, 'createdAt' | 'updatedAt'>;

export type IBillMenu = IBillItem;

// Products
export type ICategory = Category & {
  products: IProduct[];
};

export type IProduct = Product;
export type INewProduct = Optional<Omit<IProduct, 'createdAt' | 'updatedAt'>, 'id'>;
