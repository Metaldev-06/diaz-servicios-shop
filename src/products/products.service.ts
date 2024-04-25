import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

import { Product, ProductImage } from './entities';
import { Brand } from '@brands/entities/brand.entity';
import { CreateProductDto, UpdateProductDto } from './dto/index';
import { PaginationDto } from '@common/dtos/pagination.dto';
import { HandleDBExceptions } from '@common/helpers/handleDBExeption.helper';

@Injectable()
export class ProductsService {
  private readonly nameService = 'ProductsService';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetail } = createProductDto;
      const brand = await this.brandRepository.findOneBy({
        id: createProductDto.brand,
      });

      const newProduct = this.productRepository.create({
        ...productDetail,
        brand,
        images: images.map((url) =>
          this.productImageRepository.create({ url }),
        ),
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
      relations: {
        images: true,
        brand: true,
      },
    });
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('title =:title or slug =:slug', {
          title: term.toLowerCase().trim(),
          slug: term.toLowerCase().trim(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .leftJoinAndSelect('prod.brand', 'brand')
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
      images: [],
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
      await this.productRepository.softDelete({ id });

      return {
        message: 'product deleted',
      };
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  async delete(id: string) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      await this.productRepository.remove(product);

      return {
        message: 'product deleted',
      };
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }
}
