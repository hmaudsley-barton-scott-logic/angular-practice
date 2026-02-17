import { Component, inject } from '@angular/core';
import { TaskModel } from '../../types/TaskModel';
import { TaskService } from '../../services/task.service';
import { Observable, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, themeQuartz } from 'ag-grid-community';
import { TaskLinkRenderer } from './task-link-renderer';
import { TaskStatusRenderer } from './task-status-renderer';

@Component({
  selector: 'app-tasks',
  imports: [AgGridAngular, CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  private taskService = inject(TaskService);

  tasks$: Observable<TaskModel[]> = this.taskService.refresh$.pipe(
    startWith(null),
    switchMap(() => this.taskService.getTasks()),
  );

  columnDefs: ColDef[] = [
    {
      field: 'code',
      headerName: 'Code',
      sortable: true,
      cellRenderer: TaskLinkRenderer,
    },
    {
      field: 'summary',
      headerName: 'Summary',
      sortable: true,
      cellRenderer: TaskLinkRenderer,
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: true,
      filter: true,
      cellRenderer: TaskStatusRenderer,
    },
    {
      field: 'assigneeName',
      headerName: 'Assignee',
      sortable: true,
      filter: true,
    },
    {
      field: 'dueDate',
      headerName: 'Due Date',
      sortable: true,
      valueFormatter: (params) => (params.value ? new Date(params.value).toLocaleDateString() : ''),
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
  };

  theme = themeQuartz;
}
