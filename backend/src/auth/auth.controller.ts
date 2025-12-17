import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    // @Get('login')
    // login(){
    //     return {message:"Login Successfull"}
    // }
    @Post('register')
    async register(@Body() registerUserDto: RegisterDto) {
        const token = await this.authService.registerUser(registerUserDto);
        return token;
    }
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const token = await this.authService.login(loginDto);
        return token;
    }
}
