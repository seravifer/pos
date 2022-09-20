import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
        billItems: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
            menu: {
              select: {
                name: true,
              },
            },
            billSubItem: {
              include: {
                product: {
                  select: {
                    name: true,
                  },
                },
                section: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    return data.map((bill) => {
      const { billItems, ...data } = bill;
      return {
        ...data,
        billItems: billItems.map((item) => {
          const { product, menu, billSubItem, ...billItemData } = item;
          return {
            ...billItemData,
            name: product?.name ?? menu?.name,
            sections: billSubItem.map((subitem) => {
              return {
                id: subitem.id,
                section: {
                  id: subitem.sectionId,
                  name: subitem.section.name,
                },
                products: [
                  {
                    id: subitem.productId,
                    name: subitem.product.name,
                    supplement: subitem.supplement,
                  },
                ],
              };
            }),
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
