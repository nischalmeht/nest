import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'default_jwt_secret',
    //   signOptions: { expiresIn: '1d' },
    // }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET  || 'default_jwt_secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
