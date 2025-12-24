import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 40,
  })
  name: string;

    @Prop()
    id: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 8,
    select: false,
  })
  password: string;

  @Prop({
    enum: ['admin', 'manager','waiter'],
    default: 'manager',
  })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// /* 🔐 Password Hashing Middleware */
// UserSchema.pre<UserDocument>('save', async function (next) {
//   if (!this.isModified('password')) return next();

//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// /* 🔍 Compare Password */
// UserSchema.methods.comparePassword = async function (
//   candidatePassword: string,
// ): Promise<boolean> {
//   return bcrypt.compare(candidatePassword, this.password);
// };
