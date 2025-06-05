import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { typeOrmConfig } from './config/typeorm.config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD, Reflector } from '@nestjs/core';
// import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtAuth } from './config/middleware/jwt.middleware';
import { BullModule } from '@nestjs/bull';
import { ExcelModule } from './excel/excel.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), 
    TodoModule,
    JwtModule.register({
      secret: '!@#$%^&*',
      signOptions: { expiresIn: '60m' },
    }),
       BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'excel-generation',
    }),
    ExcelModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (jwt: JwtService, reflector: Reflector) =>
        new JwtAuth(jwt, reflector),
      inject: [JwtService, Reflector],
    },
  ],
})
export class AppModule { }
