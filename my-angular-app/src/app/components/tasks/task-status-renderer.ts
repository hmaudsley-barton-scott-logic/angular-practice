import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { TaskStatusUpdate } from '../task-status-update/task-status-update';
import { TaskModel } from '../../types/TaskModel';

/**
 * AG Grid cell renderer for task status.
 * Wraps the reusable TaskStatusUpdate component in compact mode.
 */
@Component({
  selector: 'app-task-status-renderer',
  standalone: true,
  imports: [TaskStatusUpdate],
  template: `
    <app-task-status-update
      [taskId]="taskId"
      [currentStatus]="status"
      [compact]="true"
      (statusUpdated)="onStatusUpdated($event)"
    >
    </app-task-status-update>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class TaskStatusRenderer implements ICellRendererAngularComp {
  status = '';
  taskId = '';

  agInit(params: ICellRendererParams): void {
    this.status = params.value;
    this.taskId = params.data?.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.status = params.value;
    this.taskId = params.data?.id;
    return true;
  }

  onStatusUpdated(updatedTask: TaskModel): void {
    this.status = updatedTask.status;
  }
}
