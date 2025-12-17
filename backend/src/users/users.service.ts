import { Injectable ,ConflictException} from '@nestjs/common'; 
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}
   async createUser(registerDto:RegisterDto){
     try {
          return await this.userModel.create({
            name:registerDto.name,
            email:registerDto.email,
            password:registerDto.password,           
        })
     } catch (err: unknown) {
      const e = err as { code?: number };

      const DUPLICATE_KEY_CODE = 11000;
      if (e.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email is already taken.');
      }

      throw err;
    }
    }
    async findByEmail(email: string) {
      // include password (schema sets select: false by default)
      return this.userModel.findOne({ email }).select('+password').lean().exec();
    }
}
