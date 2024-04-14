import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @Transform(({ value }) => value?.toString().trim().toLocaleLowerCase())
  @IsString()
  name: string;
}
