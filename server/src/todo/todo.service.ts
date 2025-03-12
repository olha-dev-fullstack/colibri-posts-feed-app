import { CollectionReference, Timestamp } from '@google-cloud/firestore';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { TodoDocument } from './todo.document';

@Injectable()
export class RawReadingsService {
  private logger: Logger = new Logger(RawReadingsService.name);

  constructor(
    @Inject(TodoDocument.collectionName)
    private todosCollection: CollectionReference<TodoDocument>,
  ) {}

  async create({ name, dueDate }): Promise<TodoDocument> {
    const docRef = this.todosCollection.doc(name);
    const dueDateMillis = dayjs(dueDate).valueOf();
    await docRef.set({
      name,
      dueDate: Timestamp.fromMillis(dueDateMillis),
    });
    const todoDoc = await docRef.get();
    const todo = todoDoc.data();
    return todo;
  }

  async findAll(): Promise<TodoDocument[]> {
    const snapshot = await this.todosCollection.get();
    const todos: TodoDocument[] = [];
    snapshot.forEach((doc) => todos.push(doc.data()));
    return todos;
  }
}
