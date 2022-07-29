import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { Item } from '@pos/models';
import { DBService } from '../db.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.item.findMany();
  }

  @Post()
  createOrUpdate(@Body() item: Item) {
    return this.dbService.item.upsert({
      where: {
        id: item.id,
      },
      update: item,
      create: item,
    });
  }

  @Post('/_bulk')
  createOrUpdateAll(@Body() items: Item[]) {
    const update = items.map((item) => {
      return this.dbService.item.upsert({
        where: {
          id: item.id,
        },
        update: item,
        create: item,
      });
    });
    return this.dbService.$transaction(update);
  }

  @Delete('/_bulk')
  deleteAll(@Body() ids: string[]) {
    return this.dbService.item.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.item.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.dbService.item.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.item.delete({
      where: { id },
    });
  }
}
