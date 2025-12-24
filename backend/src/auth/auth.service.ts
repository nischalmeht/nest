import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRole, UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }
  // async registerUser(registerUserDto: RegisterDto) {
  //   console.log('registerDto', registerUserDto);


  //   const user = await this.userService.createUser({
  //     ...registerUserDto,
  //     password: registerUserDto.password,
  //     role:registerUserDto.role
  //   });

  //   // todo: remove role admin from here. only for test.
  //   const payload = { sub: user._id, };
  //   const token = await this.jwtService.signAsync(payload);
  //   console.log('token');
  //   return { access_token: token };
  // }
  // async login(loginDto: LoginDto) {
  //   console.log('loginDto', loginDto);
  //   const { email, password } = loginDto;

  //   // 1️⃣ Find user & explicitly select password
  //   const user = await this.userService.findByEmail(email);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   // 2️⃣ Compare password using schema instance method when available
  //   // if the document exposes comparePassword, use it; otherwise fall back to bcrypt.compare
  //   // let isPasswordValid = false;
  //   // if (typeof (user as any).comparePassword === 'function') {
  //   //   isPasswordValid = await (user as any).comparePassword(password);
  //   // } else {
  //   //   isPasswordValid = await bcrypt.compare(password, (user as any).password);
  //   // }
  //   // if (!isPasswordValid) {
  //   //   throw new UnauthorizedException('Invalid credentials');
  //   // }

  //   // 3️⃣ Generate JWT
  //   const payload = {
  //     sub: user._id,

  //     email: user.email,
  //     role: user.role,
  //   };

  //   const accessToken = await this.jwtService.signAsync(payload);

  //   return {
  //     access_token: accessToken,
  //   };
  // }
  async createUser(registerDto: RegisterDto) {
    console.log('registerDto service', registerDto);
    const existingUser = await this.userService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already in use! Please try with a different email',
      );
    }

    const user = await this.userService.createUser({
      ...registerDto,
      role: registerDto.role
    } as RegisterDto);


    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...result } = userObject as any;

    return {
      user: result,
      message: 'Registration successful! Please login to continue',
    };
  }

   
  async findByEmail(email: string) {
    return await this.userService.findByEmail(email);
  }
  async getUserById(id: string) {
    return await this.userService.getUserById(id);
  }
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Invalid credentials or account not exists',
      );
    }

    //generate the tokens
    const tokens = this.generateTokens(user);
    const userObject = user.toObject ? user.toObject() : user;
    const { password, ...result } = userObject as any;
    return {
      user: result,
      ...tokens,
    };
  }
   private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }
  private generateAccessToken(user: User): string {
    // -> email , sub (id), role -> vvvI -> RBAC -> user ? Admin ?
    const payload = {
      email: user.email,
      sub: (user as any)._id?.toString() || (user as any).id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: 'jwt_secret',
      expiresIn: '15m',
    });
  }

  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: 'refresh_secret',
      expiresIn: '7d',
    });
  }
  
  async createAdmin(registerDto: RegisterDto) {
    return registerDto;
  }
}
