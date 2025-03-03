import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly todoService: RawReadingsService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // @Post('to-do')
  // async createToDo(@Body() todoData: { name: string; dueDate: Timestamp }) {
  //   return this.todoService.create(todoData);
  // }

  // @Get('to-do')
  // async getToDos(): Promise<TodoDocument[]> {
  //   return this.todoService.findAll();
  // }
}
