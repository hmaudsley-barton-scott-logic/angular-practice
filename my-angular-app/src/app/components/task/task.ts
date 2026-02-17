import { Component, inject } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { DatePipe, AsyncPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap, startWith } from 'rxjs/operators';
import { TaskStatusUpdate } from '../task-status-update/task-status-update';

@Component({
  selector: 'app-task',
  imports: [DatePipe, AsyncPipe, TaskStatusUpdate],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  private readonly taskService = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly refreshTrigger$ = new Subject<void>();

  task$: Observable<TaskModel | null> = this.refreshTrigger$.pipe(
    startWith(undefined),
    switchMap(() => this.activatedRoute.paramMap),
    map((params) => params.get('taskId')),
    switchMap((id) => {
      if (id === null) {
        return of(null);
      }
      return this.taskService.getTask(id);
    }),
  );

  onStatusUpdated() {
    this.refreshTrigger$.next();
  }
}
