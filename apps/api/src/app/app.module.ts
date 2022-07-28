import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { DBService } from './db.service';
import { CategoriesController } from './controllers/categories.controller';
import { BillsController } from './controllers/bills.controller';
import { UsersController } from './controllers/users.controller';
import { TablesController } from './controllers/tables.controller';

@Module({
  imports: [],
  controllers: [
    ProductsController,
    CategoriesController,
    BillsController,
    UsersController,
    TablesController,
  ],
  providers: [DBService],
})
export class AppModule {}
