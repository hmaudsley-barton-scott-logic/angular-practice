import { Component, inject } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { TaskService } from '../../services/task.service';
import { TaskPreview } from '../task-preview/task-preview';
import { Observable, startWith, switchMap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [TaskPreview, AsyncPipe, CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  taskService = inject(TaskService);

  // Get the reactive tasks observable from the service

  // Reactive observable that loads tasks on init and refresh
  tasks$: Observable<TaskModel[]> = this.taskService.refresh$.pipe(
    startWith(null), // Emit null initially to trigger first load
    switchMap(() => this.taskService.getTasks()),
  );
}
