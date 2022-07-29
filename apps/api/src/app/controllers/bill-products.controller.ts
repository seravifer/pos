import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BProduct } from '@pos/models';
import { DBService } from '../db.service';

@Controller('bills/:id/products')
export class BillProductsController {
  constructor(private readonly dbService: DBService) {}

  @Post()
  create(@Param('id') billId: string, @Body() item: BProduct) {
    const product = {
      id: item.id,
      billId,
      productId: item.productId,
      price: item.price,
      quantity: item.quantity,
    };
    return this.dbService.billProducts.upsert({
      where: {
        id: item.id,
      },
      update: product,
      create: product,
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.billProducts.findUnique({ where: { id } });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.bill.delete({
      where: { id },
    });
  }
}
