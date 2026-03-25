import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true })
  category: MongooseSchema.Types.ObjectId;

  @Prop()
  brand?: string;

  @Prop()
  model?: string;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Object, default: {} })
  attributes: Record<string, any>;

  @Prop({ type: Object, default: {} })
  specifications: Record<string, any>;

  @Prop({ type: [Object], default: [] })
  variants: ProductVariant[];

  @Prop({ default: 0 })
  costPrice: number;

  @Prop({ default: 0 })
  sellingPrice: number;

  @Prop({ default: 0 })
  marketPrice: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: 0 })
  lowStockThreshold: number;

  @Prop({ enum: ['draft', 'pending', 'active', 'inactive'], default: 'draft' })
  status: string;

  @Prop({ default: 0 })
  sort: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export interface ProductVariant {
  sku: string;
  name: string;
  attributes: Record<string, string>;
  costPrice?: number;
  sellingPrice?: number;
  stock?: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text', sku: 'text' });
ProductSchema.index({ category: 1, status: 1 });