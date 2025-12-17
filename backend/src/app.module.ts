import { Module } from '@nestjs/common';8
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ControllerService } from './controller/controller.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule, UsersModule,MongooseModule.forRoot(process.env.MONGO_URI as string)],
  controllers: [AppController],
  providers: [AppService, ControllerService],
})
export class AppModule {}
