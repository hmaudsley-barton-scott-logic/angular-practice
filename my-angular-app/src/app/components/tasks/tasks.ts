import { Component, inject } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  tasks: TaskModel[] | undefined;

  private taskService = inject(TaskService);

  ngOnInit() {
    this.loadTasks();
    this.taskService.refresh$.subscribe(() => {
      this.loadTasks();
      console.log(this.tasks);
    });
  }

  loadTasks() {
    console.log('Loading tasks...');
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      console.log('Tasks loaded:', this.tasks);
    });
  }
}
