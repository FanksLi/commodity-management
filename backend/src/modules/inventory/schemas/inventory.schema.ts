import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type InventoryDocument = Inventory & Document;

@Schema({ timestamps: true })
export class Inventory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier' })
  supplier?: MongooseSchema.Types.ObjectId;

  @Prop({
    type: String,
    enum: ['in', 'out', 'adjust', 'transfer'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ default: 0 })
  beforeStock: number;

  @Prop({ default: 0 })
  afterStock: number;

  @Prop()
  batchNo?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  relatedOrder?: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: ['purchase', 'sale', 'return', 'adjustment', 'transfer'] })
  relatedType?: string;

  @Prop()
  remark?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  operator?: MongooseSchema.Types.ObjectId;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.index({ product: 1, createdAt: -1 });
InventorySchema.index({ type: 1, createdAt: -1 });