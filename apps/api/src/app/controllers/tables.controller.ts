import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Table } from '@pos/models';
import { DBService } from '../db.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.table.findMany();
  }

  @Post()
  createOrUpdate(@Body() table: Table) {
    return this.dbService.table.upsert({
      where: {
        id: table.id,
      },
      update: table,
      create: table,
    });
  }

  @Post('/_bulk')
  createOrUpdateAll(@Body() tables: Table[]) {
    const update = tables.map((table) => {
      return this.dbService.table.upsert({
        where: {
          id: table.id,
        },
        update: table,
        create: table,
      });
    });
    return this.dbService.$transaction(update);
  }

  @Delete('/_bulk')
  deleteAll(@Body() ids: string[]) {
    return this.dbService.table.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.table.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.dbService.table.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.dbService.table.delete({
      where: { id },
    });
  }
}
