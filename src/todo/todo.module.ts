import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { Todo } from 'src/entites/todo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]),
    JwtModule.register({
      secret: '!@#$%^&*',
      signOptions: { expiresIn: '60m' },
    }),],
  providers: [TodoService],
  controllers: [TodoController]
})
export class TodoModule { }
