import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { IBillItem } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('bills/:id/items')
export class BillItemsController {
  constructor(private readonly dbService: DBService) {}

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.billItem.findUnique({ where: { id } });
  }

  @Post()
  async create(@Param('id') billId: string, @Body() item: IBillItem) {
    const product = {
      id: item.id,
      billId,
      menuId: item.menuId,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    };

    const billtem = this.dbService.billItem.upsert({
      where: {
        id: item.id,
      },
      update: product,
      create: product,
    });
    item.sections = item.sections ?? [];
    const subitems = item.sections.map((subitem) => {
      const data = {
        id: subitem.id,
        billItemId: item.id,
        sectionId: subitem.section.id,
        quantity: 1,
        productId: subitem.products[0].id,
        supplement: subitem.products[0].supplement,
      };
      return this.dbService.billSubItem.upsert({
        where: {
          id: subitem.id,
        },
        update: data,
        create: data,
      });
    });
    return this.dbService.$transaction([billtem, ...subitems]);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.billItem.delete({
      where: { id },
    });
  }
}
