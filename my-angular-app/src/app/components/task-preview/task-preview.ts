import { Component, input } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-preview',
  imports: [DatePipe],
  templateUrl: './task-preview.html',
  styleUrl: './task-preview.css',
})
export class TaskPreview {
  task = input.required<TaskModel>();
}
