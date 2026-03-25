import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  parent?: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  level: number;

  @Prop({ default: 0 })
  sort: number;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 1, parent: 1 }, { unique: true });