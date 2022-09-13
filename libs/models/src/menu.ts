import { Product, Section } from '.';

export type MenuDto = {
  name: string;
  active: boolean;
  sections: MenuSectionDto[];
};

export type MenuSectionDto = {
  name: string;
  sectionId: string;
  maxProducts: number;
};

export type SectionWithProducts = Section & {
  products: Product[];
};
