import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MenuDto } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.menu.findMany();
  }

  @Post()
  create(@Body() data: MenuDto) {
    const { sections, ...menu } = data;
    console.log(menu);
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

  @Get(':id')
  async getById(@Param('id') id: string) {
    const data = await this.dbService.menu.findUnique({
      where: { id },
      include: {
        menuSection: true,
      },
    });
    const { menuSection, ...section } = data;
    return {
      ...section,
      sections: menuSection.map((el) => {
        return {
          sectionId: el.sectionId,
          name: el.name,
          maxProducts: el.maxProducts,
        };
      }),
    };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: MenuDto) {
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

    return this.dbService.$transaction([
      deleteRelation,
      createRelation,
      updateMenu,
    ]);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.menu.delete({
      where: { id },
    });
  }
}
