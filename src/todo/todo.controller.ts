import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from 'src/entites/todo.entity';

@Controller('todos')
export class TodoController {

    constructor(private readonly todoService: TodoService) { }

    @Get()
    async findAll() {
        try {
            const todoList = await this.todoService.findAll();
            return {
                status: 200,
                message: 'Todo list successfully fetched...',
                todoList
            }
        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }
    }


    @Post()
    async create(@Body() todo: Partial<Todo>) {
        try {
            const { id } = await this.todoService.create(todo)
            return {
                status: 200,
                message: 'Todo added successfully...',
                todoId: id
            }
        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }

    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        try {
            const todoDetails = await this.todoService.findOne({ id: Number(id) });
            return {
                status: 200,
                message: 'Todo details successfully fetched...',
                todoDetails
            }
        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updatedInfo: Partial<Todo>) {
        try {
            const todoList = await this.todoService.update({ id: Number(id) }, updatedInfo);;
            return {
                status: 200,
                message: 'Todo Updated successfully',
                todoList
            }
        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }
    }

    
    @Delete(':id')
     async remove(@Param('id') id: number) {
        try {
            await this.todoService.remove({ id: Number(id) });
            return {
                status: 200,
                message: 'Todo deleted successfully',
            }
        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }
    }

}
