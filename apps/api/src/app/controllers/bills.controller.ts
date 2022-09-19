import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IBill, INewBill } from '@pos/models';
import { Bill } from '@prisma/client';
import { DBService } from '../services/db.service';

@Controller('bills')
export class BillsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  async get(): Promise<IBill[]> {
    const data = await this.dbService.bill.findMany({
      where: {
        closedAt: null,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    return data.map((bill) => {
      const { products, ...rest } = bill;
      return {
        ...rest,
        products: products.map((product) => {
          const {
            product: { name },
            ...rest
          } = product;
          return {
            ...rest,
            name,
          };
        }),
      };
    });
  }

  @Post()
  create(@Body() data: INewBill): Promise<Bill> {
    return this.dbService.bill.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.bill.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: INewBill): Promise<Bill> {
    return this.dbService.bill.update({
      where: { id },
      data: data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Bill> {
    return this.dbService.bill.delete({
      where: { id },
    });
  }
}
