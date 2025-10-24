import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../service/todo.service';
import { TodoStatus } from '../model/todo';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class TodoComponent {
  todoService = inject(TodoService);
  
  newTodoName = '';
  newTodoContent = '';

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  addTodo(): void {
    if (this.newTodoName.trim() && this.newTodoContent.trim()) {
      this.todoService.addTodo(this.newTodoName, this.newTodoContent);
      this.newTodoName = '';
      this.newTodoContent = '';
    }
  }

  moveToWaiting(id: number): void {
    this.todoService.updateTodoStatus(id, 'waiting');
  }

  moveToInProgress(id: number): void {
    this.todoService.updateTodoStatus(id, 'in progress');
  }

  moveToDone(id: number): void {
    this.todoService.updateTodoStatus(id, 'done');
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }
}
