import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }) => value.trim().toLowerCase())
  @IsString()
  title: string;

  //   @Transform(({ value }) => value.trim())
  @IsString()
  @IsOptional()
  slug?: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  description: string;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  price: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  stock: number;

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsOptional()
  discount?: number;

  @IsString()
  brand: string;
}
