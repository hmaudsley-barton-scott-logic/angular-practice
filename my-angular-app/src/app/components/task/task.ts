import { Component, input } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task',
  imports: [DatePipe],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  task = input.required<TaskModel>();
}
