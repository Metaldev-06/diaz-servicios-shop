import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { BrandsModule } from 'src/brands/brands.module';
import { Product, ProductImage } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductImage]), BrandsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
