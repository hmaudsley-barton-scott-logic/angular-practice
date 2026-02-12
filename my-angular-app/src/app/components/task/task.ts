import { Component, inject } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { DatePipe, AsyncPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  imports: [DatePipe, AsyncPipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  private readonly taskService = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);

  task$: Observable<TaskModel> = this.activatedRoute.paramMap.pipe(
    map((params) => params.get('taskId')),
    switchMap((id) => {
      if (id === null) {
        return throwError(() => new Error('Path parameter does not exist'));
      }
      return this.taskService.getTask(id);
    }),
  );
}
