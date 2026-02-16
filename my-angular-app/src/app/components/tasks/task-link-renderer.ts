import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-task-link-renderer',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (taskId) {
      <a class="task__link" [routerLink]="['/tasks', taskId]">{{ value }}</a>
    } @else {
      <span>{{ value }}</span>
    }
  `,
  styles: [
    `
      .task__link {
        color: var(--accent, #0f6b6b);
        text-decoration: none;
      }
      .task__link:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class TaskLinkRenderer implements ICellRendererAngularComp {
  value: string = '';
  taskId: string | null = null;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.taskId = params.data?.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.taskId = params.data?.id;
    return true;
  }
}
