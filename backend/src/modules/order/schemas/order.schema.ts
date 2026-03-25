import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Schema as MongoSchema } from 'mongoose';

export type OrderDocument = Order & Document;

const OrderItemSchema = new MongoSchema(
  {
    product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true },
    remark: { type: String },
  },
  { _id: false },
);

export interface OrderItem {
  product: MongooseSchema.Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  remark?: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNo: string;

  @Prop({
    type: String,
    enum: ['purchase', 'sale', 'return'],
    required: true,
  })
  type: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Supplier' })
  supplier?: MongooseSchema.Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ default: 0 })
  totalAmount: number;

  @Prop({ default: 0 })
  discountAmount: number;

  @Prop({ default: 0 })
  paidAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop()
  remark?: string;

  @Prop({ type: Object })
  shippingInfo?: {
    receiver?: string;
    phone?: string;
    address?: string;
    trackingNo?: string;
  };

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ orderNo: 1 });
OrderSchema.index({ type: 1, status: 1 });
OrderSchema.index({ createdAt: -1 });