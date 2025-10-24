import { Injectable, inject, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  // All todos stored in a signal
  private todosSignal = signal<Todo[]>([
    { id: 1, name: 'Learn Angular', content: 'Complete TP1 exercises', status: 'in progress' },
    { id: 2, name: 'Setup project', content: 'Clone and install dependencies', status: 'done' },
    { id: 3, name: 'Deploy app', content: 'Deploy to production', status: 'waiting' }
  ]);

  // Computed signals for each status column
  waitingTodos = computed(() => 
    this.todosSignal().filter(todo => todo.status === 'waiting')
  );

  inProgressTodos = computed(() => 
    this.todosSignal().filter(todo => todo.status === 'in progress')
  );

  doneTodos = computed(() => 
    this.todosSignal().filter(todo => todo.status === 'done')
  );

  // Get all todos (read-only)
  todos = this.todosSignal.asReadonly();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  /**
   * elle retourne la liste des todos
   *
   * @returns Todo[]
   */
  getTodos(): Todo[] {
    return this.todosSignal();
  }

  /**
   * Ajoute un nouveau todo avec le statut 'waiting' par défaut
   *
   * @param name: string
   * @param content: string
   */
  addTodo(name: string, content: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      name,
      content,
      status: 'waiting'
    };
    this.todosSignal.update(todos => [...todos, newTodo]);
  }

  /**
   * Met à jour le statut d'un todo
   *
   * @param id: number
   * @param status: TodoStatus
   */
  updateTodoStatus(id: number, status: TodoStatus): void {
    this.todosSignal.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, status } : todo
      )
    );
  }

  /**
   * Delete le todo par son id
   *
   * @param id: number
   */
  deleteTodo(id: number): void {
    this.todosSignal.update(todos =>
      todos.filter(todo => todo.id !== id)
    );
  }

  /**
   * Logger la liste des todos
   */
  logTodos(): void {
    this.loggerService.logger(this.todosSignal());
  }
}
