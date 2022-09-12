import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Bill } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('bills')
export class BillsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.bill.findMany({
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
  }

  @Post()
  create(@Body() data: Bill) {
    return this.dbService.bill.create({ data });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.bill.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Bill) {
    return this.dbService.bill.update({
      where: { id },
      data: data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.bill.delete({
      where: { id },
    });
  }
}
