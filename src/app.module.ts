import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TestModule } from './modules/test';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    /// add config module
    ConfigModule.forRoot({ isGlobal: true }),
    /// add mongoose module here in future
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost/nestjs-app'),
    UsersModule,
    AuthModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
