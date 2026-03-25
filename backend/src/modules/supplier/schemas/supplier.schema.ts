import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop()
  code?: string;

  @Prop()
  contact?: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop()
  address?: string;

  @Prop({ type: Object, default: {} })
  bankInfo?: {
    bank?: string;
    account?: string;
    accountName?: string;
  };

  @Prop()
  taxNumber?: string;

  @Prop({ type: [String], default: [] })
  categories: string[];

  @Prop({ enum: ['A', 'B', 'C', 'D'], default: 'C' })
  level: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  remark?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.index({ name: 1 }, { unique: true });
SupplierSchema.index({ code: 1 }, { unique: true, sparse: true });