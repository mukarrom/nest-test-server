import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    /// add config module
    ConfigModule.forRoot({ isGlobal: true }),
    /// add mongoose module here in future
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/nestjs-app'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
