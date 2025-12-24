import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export enum UserRole {
  MANAGER = 'manager',
  ADMIN = 'admin',
  WAITER = 'waiter',
}
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
 private jwtService: JwtService,
) { }
   async createUser(registerDto:RegisterDto){
     try {
       const hashedPassword = await this.hashPassword(registerDto.password);
          return await this.userModel.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            role: registerDto.role ?? UserRole.MANAGER,          
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
  
  private async hashPassword(password: string) : Promise<string> {
    return  bcrypt.hash(password, 10);
  }

  async getUserById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email }).select('+password').exec();
  }

  async findOne(filter: Record<string, any>) {
    return await this.userModel.findOne(filter);
  }
}