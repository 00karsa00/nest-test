import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({ example: 'test task', description: 'Title of the task' })
  title: string;

  @ApiProperty({ example: 'test descrition' })
  description?: string;

  @ApiProperty({example: false })
  isCompleted?: boolean
}
