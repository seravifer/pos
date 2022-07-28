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
import { DBService } from '../db.service';

@Controller('bills')
export class BillsController {
  constructor(private readonly dbService: DBService) {}

  @Get()
  get() {
    return this.dbService.bill.findMany();
  }

  @Post()
  creae(@Body() data: any) {
    return this.dbService.bill.create({ data });
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.bill.findUnique({ where: { id } });
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.dbService.bill.update({
      where: { id },
      data,
    });
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.dbService.bill.delete({
      where: { id },
    });
  }
}
