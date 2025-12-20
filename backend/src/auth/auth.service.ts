import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService,
    private readonly jwtService: JwtService

  ) {
  }
  async registerUser(registerUserDto: RegisterDto) {
    console.log('registerDto', registerUserDto);


    const user = await this.userService.createUser({
      ...registerUserDto,
      password: registerUserDto.password,
      role:registerUserDto.role
    });

    // todo: remove role admin from here. only for test.
    const payload = { sub: user._id, };
    const token = await this.jwtService.signAsync(payload);
    console.log('token');
    return { access_token: token };
  }
  async login(loginDto: LoginDto) {
    console.log('loginDto', loginDto);
    const { email, password } = loginDto;

    // 1️⃣ Find user & explicitly select password
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // 2️⃣ Compare password using schema instance method when available
    // if the document exposes comparePassword, use it; otherwise fall back to bcrypt.compare
    // let isPasswordValid = false;
    // if (typeof (user as any).comparePassword === 'function') {
    //   isPasswordValid = await (user as any).comparePassword(password);
    // } else {
    //   isPasswordValid = await bcrypt.compare(password, (user as any).password);
    // }
    // if (!isPasswordValid) {
    //   throw new UnauthorizedException('Invalid credentials');
    // }

    // 3️⃣ Generate JWT
    const payload = {
      sub: user._id,

      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
