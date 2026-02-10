import { Routes } from '@angular/router';
import { Tasks } from './components/tasks/tasks';
import { Task } from './components/task/task';

export const routes: Routes = [
  {
    path: 'tasks',
    component: Tasks,
  },
  {
    path: 'tasks/:taskId',
    component: Task,
  },
];
