import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { IBillProduct } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('bills/:id/products')
export class BillProductsController {
  constructor(private readonly dbService: DBService) {}

  @Post()
  create(@Param('id') billId: string, @Body() item: IBillProduct) {
    const product = {
      id: item.id,
      billId,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    };
    return this.dbService.billProduct.upsert({
      where: {
        id: item.id,
      },
      update: product,
      create: product,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.billProduct.findUnique({ where: { id } });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.billProduct.delete({
      where: { id },
    });
  }
}
