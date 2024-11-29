// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Event } from './entities/event.entity';
import { Photo } from './entities/photo.entity';
import { Vote } from './entities/vote.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { PhotosModule } from './modules/photos/photos.module';
import { VotesModule } from './modules/votes/votes.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Event, Photo, Vote],
        synchronize: true, // set to false in production
        // dropSchema: true,
        logging: true, //per vedere le query
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    EventsModule,
    PhotosModule,
    VotesModule,
    AuthModule,
  ],
  controllers: [AppController], // Aggiungi il controller
  providers: [AppService],
})
export class AppModule { }
