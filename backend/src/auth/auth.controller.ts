import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserRole, UsersService } from 'src/users/users.service';
import { AuthGuard } from './auth.guard';
import { Roles } from './decorators/roles.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { LoginThrottlerGuard } from './guards/login-throttler.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService

    ) { }

    @Post('register')
    async register(@Body() registerUserDto: RegisterDto) {
        console.log('registerDto controller', registerUserDto);
        const token = await this.authService.createUser(registerUserDto);
        return token;
    }
    @UseGuards(LoginThrottlerGuard)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        console.log('loginDto controller', loginDto);
        const token = await this.authService.login(loginDto);
        return token;
    }
    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req) {
        const userId = req.user.sub;
        const user = await this.userService.getUserById(userId);
        return {
            id: user?._id,
            name: user?.name,
            email: user?.email
        }
     }
    @Post('create-admin')
    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    createAdmin(@Body() registerDto: RegisterDto) {
        console.log("hello")
        return this.authService.createAdmin(registerDto);
    }
}
