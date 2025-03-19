import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/entites/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {

    constructor(
        @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>
    ) {

    }

    async create(todo: Partial<Todo>): Promise<Todo> {
        try {
            return this.todoRepository.save(todo);
        } catch (e) {
            console.log(e);
            throw new Error(e.message)
        }
    }

    async findAll(): Promise<Todo[]> {
        try {
            return this.todoRepository.find();
        } catch (e) {
            console.log(e);
            throw new Error(e.message)
        }
    }


    async findWithFilterAll(condition: object): Promise<Todo[]> {
        try {
            return this.todoRepository.findBy(condition);
        } catch (e) {
            console.log(e);
            throw new Error(e.message)
        }
    }

    async findOne(condition: object): Promise<Todo | null> {
        try {
            return await this.todoRepository.findOneBy(condition);
        } catch (e) {
            console.log(e);
            throw new Error(e.message)
        }
    }

    async update(condition: object, todoInfo: Partial<Todo>) {
        const todo = await this.todoRepository.findOneBy(condition);
        if (!todo) {
            throw new Error(`Todo not found for this condition: ${JSON.stringify(condition)}`);
        }
        Object.assign(todo, todoInfo);
        return this.todoRepository.save(todo);
    }

    async remove(condition: object) {
        const result = await this.todoRepository.delete(condition);
        if (result.affected === 0) {
            throw new Error(`Todo not found for this condition: ${JSON.stringify(condition)}`);
        }
    }

}
