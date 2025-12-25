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
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './users/schema/user.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [AuthModule, 
      ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,MongooseModule.forRoot(process.env.MONGO_URI as string),
     CourseModule, FloorModule, HotelModule, MenuModule,
     JwtModule.register({}),
         ThrottlerModule.forRoot({
           throttlers: [
             {
               ttl: 60000,
               limit: 10,
             },
           ],
         }),
            CacheModule.register({
           isGlobal: true,
           ttl: 30000,
           max: 100,
         }),
    // imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    FileUploadModule,
      // ],
    ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
