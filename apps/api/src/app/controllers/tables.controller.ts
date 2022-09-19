import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ITable } from '@pos/models';
import { DBService } from '../services/db.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.table.findMany();
  }

  @Post()
  createOrUpdate(@Body() table: ITable) {
    return this.dbService.table.upsert({
      where: {
        id: table.id,
      },
      update: table,
      create: table,
    });
  }

  @Post('/_bulk')
  createOrUpdateAll(@Body() tables: ITable[]) {
    const deleteAll = this.dbService.table.deleteMany({
      where: {
        id: {
          notIn: tables.map((t) => t.id),
        },
      },
    });
    const update = tables.map((table) => {
      return this.dbService.table.upsert({
        where: {
          id: table.id,
        },
        update: table,
        create: table,
      });
    });
    return this.dbService.$transaction([deleteAll, ...update]);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.dbService.table.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: ITable) {
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
