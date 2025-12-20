// export class CreateHotelDto {

// }

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsObject,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

class LocationDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  pincode: string;

}

export class CreateHotelDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsObject()
  location: LocationDto;
  @IsNumber()
  totalRooms: number;

  @IsNumber()
  totalFloors: number;
  @IsNumber()
  availableRooms: number;
  
  
}
