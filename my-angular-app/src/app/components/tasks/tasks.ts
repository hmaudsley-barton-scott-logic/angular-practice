import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { TaskService } from '../../services/task.service';
import { TaskPreview } from '../task-preview/task-preview';

@Component({
  selector: 'app-tasks',
  imports: [TaskPreview],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  private taskService = inject(TaskService);
  tasks = signal<TaskModel[]>([]);

  ngOnInit() {
    this.loadTasks();
    this.taskService.refresh$.subscribe(() => {
      this.loadTasks();
    });
  }

  loadTasks() {
    console.log('Loading tasks...');
    this.taskService.getTasks().subscribe((data) => {
      this.tasks.set(data);
      console.log('Tasks loaded:', this.tasks());
    });
  }
}
