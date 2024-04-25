import { Exclude } from 'class-transformer';
import { Brand } from 'src/brands/entities/brand.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './index';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
    nullable: false,
  })
  title: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('text')
  description: string;

  @Column('numeric', {
    nullable: false,
  })
  price: number;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('int', {
    default: 0,
  })
  discount: number;

  @ManyToOne(() => Brand, (brand) => brand.id, {
    nullable: false,
    eager: true,
  })
  brand: Brand;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  checkSlugBeforeInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '-')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugBeforeUpdate() {
    this.slug = this.title
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
