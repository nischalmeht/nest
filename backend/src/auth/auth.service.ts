import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(  private readonly userService: UsersService,
        private readonly jwtService: JwtService

    ){
           }
            async registerUser(registerUserDto: RegisterDto) {
    console.log('registerDto', registerUserDto);

    // Logic for user register
    /**
     * 1. check if email already exists
     * 2. store the user into db (password hashing handled by schema pre-save)
     * 3. generate jwt token
     * 4. send token in response
     */

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: registerUserDto.password,
    });

    // todo: remove role admin from here. only for test.
    const payload = { sub: user._id, };
    const token = await this.jwtService.signAsync(payload);
    console.log('token');
    return { access_token: token };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }
}
