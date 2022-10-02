import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IMenu, INewMenu } from '@pos/models';
import { Menu, MenuSection, SectionProduct, Product } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';
import { DBService } from '../services/db.service';

const query = {
  menuSection: {
    include: {
      section: {
        select: {
          sectionProduct: {
            include: {
              product: true,
            },
          },
        },
      },
    },
  },
};

@Controller('menus')
@UseGuards(AuthGuard)
export class MenusController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  async getAll(@Query('isActive') active: boolean): Promise<IMenu[]> {
    const where = active ? { active: !!active } : {};
    const menus = await this.dbService.menu.findMany({
      include: query,
      where,
    });
    return menus.map((menu) => this.mapResponse(menu));
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<IMenu> {
    const menu = await this.dbService.menu.findUnique({
      where: { id },
      include: query,
    });
    return this.mapResponse(menu);
  }

  @Post()
  create(@Body() data: INewMenu) {
    const { sections, ...menu } = data;
    return this.dbService.menu.create({
      data: {
        ...menu,
        menuSection: {
          create: sections.map((el) => {
            return {
              name: el.name,
              maxProducts: el.maxProducts,
              section: {
                connect: {
                  id: el.sectionId,
                },
              },
            };
          }),
        },
      },
    });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: INewMenu) {
    const { sections, ...menu } = data;
    const deleteRelation = this.dbService.menuSection.deleteMany({
      where: {
        menuId: id,
      },
    });
    const createRelation = this.dbService.menuSection.createMany({
      data: sections.map((el) => {
        return {
          name: el.name,
          sectionId: el.sectionId,
          maxProducts: el.maxProducts,
          menuId: id,
        };
      }),
    });
    const updateMenu = this.dbService.menu.update({
      where: { id },
      data: menu,
    });

    return this.dbService.$transaction([deleteRelation, createRelation, updateMenu]);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.menu.delete({
      where: { id },
    });
  }

  private mapResponse(
    menu: Menu & {
      menuSection: (MenuSection & {
        section: {
          sectionProduct: (SectionProduct & {
            product: Product;
          })[];
        };
      })[];
    }
  ) {
    const { menuSection, ...menuData } = menu;
    return {
      ...menuData,
      sections: menuSection.map((el) => {
        const { section, ...sectionData } = el;
        return {
          id: sectionData.sectionId,
          name: sectionData.name,
          maxProducts: sectionData.maxProducts,
          products: section.sectionProduct.map((el) => {
            return {
              supplement: el.supplement,
              ...el.product,
            };
          }),
        };
      }),
    };
  }
}
