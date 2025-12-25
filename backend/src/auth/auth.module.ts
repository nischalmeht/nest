import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { JwtStrategy } from './strategies/jwt.stragies';

@Module({
  imports: [
    UsersModule,
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET || 'default_jwt_secret',
    //   signOptions: { expiresIn: '1d' },
    // }),

    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET  || 'default_jwt_secret',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,RolesGuard,JwtStrategy],
  exports: [AuthService, RolesGuard],

})
export class AuthModule {}
