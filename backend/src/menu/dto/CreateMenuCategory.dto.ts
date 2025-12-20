
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class CreateMenuCategoryDto {

    @IsNotEmpty({ message: 'Name is required! Please provide name' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 3 charaters long' })
    @MaxLength(50, { message: 'Name can not be longer than 50 charaters' })
    name: string;

    @IsOptional()
    description?: string;

    @IsNotEmpty({ message: 'Hotel ID is required' })
    hotelId?: string
    @IsOptional()
    isActive?: boolean;

}
