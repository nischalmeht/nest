import { Module } from '@nestjs/common';8
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { FloorModule } from './floor/floor.module';
import { HotelModule } from './hotel/hotel.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [ConfigModule.forRoot(),AuthModule, UsersModule,MongooseModule.forRoot(process.env.MONGO_URI as string), CourseModule, FloorModule, HotelModule, MenuModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
