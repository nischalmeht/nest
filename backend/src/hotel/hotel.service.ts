import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Hotel, HotelDocument } from './schema/hotel.schema';
import { Model } from 'mongoose';
// import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class HotelService {
  constructor( @InjectModel(Hotel.name)
   @InjectModel(Hotel.name)
    private hotelModel: Model<HotelDocument>,){}
  async createHotel(createHotelDto: CreateHotelDto) {
    const hotel = new this.hotelModel({
      ...createHotelDto,
      averageRating: 0,
      totalReviews: 0,
    });

    return hotel.save();
  }

  findAll() {
   return this.hotelModel
      .find({ isActive: true })
      .sort({ createdAt: -1 });
  
  }

  async findOne(id: string) {
    const hotel = await this.hotelModel.findOne({
      _id: id,
      isActive: true,
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  update(id: number, updateHotelDto: UpdateHotelDto) {
    return `This action updates a #${id} hotel`;
  }
async softDelete(id: string) {
    const hotel = await this.hotelModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return {
      message: 'Hotel deleted successfully',
    };
  }

  remove(id: number) {
    return `This action removes a #${id} hotel`;
  }
}
