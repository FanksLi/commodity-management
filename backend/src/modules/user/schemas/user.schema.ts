import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  avatar?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  updatedBy?: MongooseSchema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (_doc, ret: any) {
    delete ret.password;
    return ret;
  },
});