import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HotelDocument = Hotel & Document;

@Schema({ _id: false })
export class Location {
  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ type: Number })
  latitude?: number;

  @Prop({ type: Number })
  longitude?: number;
}

@Schema({ timestamps: true })
export class Hotel {

  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    trim: true,
    maxlength: 500,
  })
  description: string;

  /* 📍 Location Info */
  @Prop({
    required: true,
    type: Location,
  })
  location: Location;

  /* ⭐ Reviews Summary (Derived / Cached) */
  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  /* 📊 Derived / Cached Counts */
  @Prop({ default: 0 })
  totalRooms: number;

  @Prop({ default: 0 })
  totalFloors: number;

  @Prop({ default: 0 })
  availableRooms: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
