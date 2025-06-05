import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTodoDto } from './dao/CreateTodoDto';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('todos')
@ApiTags('todos')
export class TodoController {

    constructor(
        private readonly todoService: TodoService,
        private readonly jwtService: JwtService,
    ) { }

    @Public()
    @Get('token/:key')
    @ApiOperation({ summary: 'genarate token' })
    @ApiResponse({ status: 200, description: 'Token generate successfully..' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
    async generateToken(@Param('key') key: string) {
        try {
            
            console.log('key => ', key);
            if (key === 'todo-123') {
                const token = this.jwtService.sign({ isValid : true });
                return { access_token: token };
            } else {
                return {
                    status: 400,
                    message: 'invalid token..',
                }
            }
            // const todoList = await this.todoService.findAll();

        } catch (e) {
            console.log(e);
            return {
                message: e.message || 'Server Error...',
                status: 500
            }
        }
    }


    @Get()
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get all todos' })
    @ApiResponse({ status: 200, description: 'List of todos returned successfully.' })
    @ApiResponse({ status: 500, description: 'Internal server error.' })
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
    @ApiBearerAuth('access-token')
    @ApiTags('Create new todo')
    @ApiBody({ type: CreateTodoDto })
    async create(@Body() todo: CreateTodoDto) {
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
    @ApiBearerAuth('access-token')
    @ApiOperation({ summary: 'Get todo by ID' })
    @ApiResponse({ status: 200, description: 'Todo details retrieved successfully.' })
    @ApiResponse({ status: 404, description: 'Todo not found.' })
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
    @ApiBearerAuth('access-token')
    async update(@Param('id') id: number, @Body() updatedInfo: CreateTodoDto) {
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
    @ApiBearerAuth('access-token')
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
