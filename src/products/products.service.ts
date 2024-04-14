import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { CreateProductDto, UpdateProductDto } from './dto/index';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Product } from './entities/product.entity';
import { Brand } from 'src/brands/entities/brand.entity';

import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly nameService = 'ProductsService';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const brand = await this.brandRepository.findOneBy({
        id: createProductDto.brand,
      });

      const newProduct = this.productRepository.create({
        ...createProductDto,
        brand,
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where('title =:title or slug =:slug', {
          title: term.toLowerCase().trim(),
          slug: term.toLowerCase().trim(),
        })
        .getOne();
    }

    if (!product)
      throw new BadRequestException(`Product with ${term} not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const brand = await this.brandRepository.findOneBy({
      id: updateProductDto.brand,
    });

    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      brand,
    });

    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      await this.productRepository.softRemove(product);

      return {
        message: 'product deleted',
      };
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }
}
