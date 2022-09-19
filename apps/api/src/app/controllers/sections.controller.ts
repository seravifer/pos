import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ISection } from '@pos/models';
import { DBService } from '@pos/api/services/db.service';

@Controller('sections')
export class SectionsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  async getAll() {
    const sections = await this.dbService.section.findMany({
      include: {
        sectionProduct: {
          select: {
            product: true,
          },
        },
      },
    });
    return sections.map((section) => {
      const { sectionProduct, ...sectionData } = section;
      return {
        ...sectionData,
        products: sectionProduct.map((el) => el.product),
      };
    });
  }

  @Post()
  create(@Body() data: ISection) {
    const { products, ...section } = data;
    return this.dbService.section.create({
      data: {
        ...section,
        sectionProduct: {
          create: products.map((el) => {
            return {
              product: {
                connect: { id: el.id },
              },
            };
          }),
        },
      },
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<ISection> {
    const data = await this.dbService.section.findUnique({
      where: { id },
      include: {
        sectionProduct: {
          select: {
            product: true,
          },
        },
      },
    });
    const { sectionProduct, ...section } = data;
    return {
      ...section,
      products: sectionProduct.map((el) => el.product),
    };
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: ISection) {
    const { products, ...section } = data;
    const deleteRelation = this.dbService.sectionProduct.deleteMany({
      where: {
        sectionId: section.id,
      },
    });
    const createRelation = this.dbService.sectionProduct.createMany({
      data: products.map((el) => {
        return {
          sectionId: section.id,
          productId: el.id,
        };
      }),
    });
    const updateSection = this.dbService.section.update({
      where: { id },
      data: section,
    });

    return this.dbService.$transaction([
      deleteRelation,
      createRelation,
      updateSection,
    ]);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.section.delete({
      where: { id },
    });
  }
}
