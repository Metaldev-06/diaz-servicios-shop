import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBrandDto, UpdateBrandDto } from './dto/index';
import { HandleDBExceptions } from 'src/common/helpers/handleDBExeption.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BrandsService {
  private readonly nameService = 'BrandsService';

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const newBrand = this.brandRepository.create(createBrandDto);

      return await this.brandRepository.save(newBrand);
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: string) {
    return await this.brandRepository.findOneBy({ id });
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.existsBrand(id);

      await this.brandRepository.save({
        ...brand,
        ...updateBrandDto,
      });

      return {
        message: 'brand updated',
      };
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  async remove(id: string) {
    try {
      const brand = await this.existsBrand(id);

      await this.brandRepository.softRemove(brand);

      return {
        message: 'brand deleted',
      };
    } catch (error) {
      HandleDBExceptions(error, this.nameService);
    }
  }

  private readonly existsBrand = (id: string) => {
    const brand = this.brandRepository.findOneBy({ id });

    if (!brand) {
      throw new BadRequestException('brand not found');
    }
    return brand;
  };
}
