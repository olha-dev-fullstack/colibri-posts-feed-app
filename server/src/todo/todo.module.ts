import { Module } from '@nestjs/common';
import { RawReadingsService } from './todo.service';

@Module({ providers: [RawReadingsService], exports: [RawReadingsService] })
export class ToDoModule {}
