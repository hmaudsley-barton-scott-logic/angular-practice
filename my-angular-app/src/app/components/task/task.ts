import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task',
  imports: [DatePipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task implements OnInit {
  taskId = signal<string>('');
  task = signal<TaskModel>({} as TaskModel);

  taskService = inject(TaskService);
  activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['taskId'];
      if (id) {
        this.taskId.set(id);
        this.getTask(id);
      }
    });
  }

  setTaskId(id: string) {
    this.taskId.set(id);
    this.getTask(id);
  }

  getTask(taskId: string) {
    this.taskService.getTask(taskId).subscribe((data) => {
      this.task.set(data);
    });
  }
}
