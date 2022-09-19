import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { IBillItem } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('bills/:id/items')
export class BillItemsController {
  constructor(private readonly dbService: DBService) {}

  @Post()
  create(@Param('id') billId: string, @Body() item: IBillItem) {
    const product = {
      id: item.id,
      billId,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    };
    return this.dbService.billItem.upsert({
      where: {
        id: item.id,
      },
      update: product,
      create: product,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.billItem.findUnique({ where: { id } });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.billItem.delete({
      where: { id },
    });
  }
}
