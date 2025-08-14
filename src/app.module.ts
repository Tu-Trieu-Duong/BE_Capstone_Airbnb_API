import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProtectStrategy } from './common/protect/protect.strategy';
import { UsersModule } from './modules/users/users.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { LocationsModule } from './modules/locations/locations.module';
import { RoomModule } from './modules/room/room.module';
import { BookingModule } from './modules/booking/booking.module';
import { CommentModule } from './modules/comment/comment.module';


@Module({
  imports: [ConfigModule.forRoot(), AuthModule, PrismaModule, UsersModule, LocationsModule, RoomModule,  BookingModule, CommentModule],
  providers: [ ProtectStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}