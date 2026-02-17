import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../types/TaskModel';
import {
  TaskStatus,
  STATUS_CONFIG,
  getStatusConfig,
  isValidTaskStatus,
} from '../../types/TaskStatus';
/**
 * Reusable component for updating task status.
 *
 * SOLID Principles:
 * - Single Responsibility: Only handles status updates
 * - Open/Closed: Extensible via inputs (available statuses)
 * - Dependency Inversion: Depends on TaskService abstraction
 *
 * Usage:
 * <app-task-status-update
 *   [taskId]="task.id"
 *   [currentStatus]="task.status"
 *   [availableStatuses]="['TODO', 'IN_PROGRESS', 'DONE']"
 *   (statusUpdated)="onStatusUpdated($event)">
 * </app-task-status-update>
 */

@Component({
  selector: 'app-task-status-update',
  imports: [CommonModule, FormsModule],
  templateUrl: './task-status-update.html',
  styleUrl: './task-status-update.css',
})
export class TaskStatusUpdate implements OnInit, OnChanges {
  private readonly taskService = inject(TaskService);

  /** The ID of the task to update */
  @Input({ required: true }) taskId!: string;

  /** The current status of the task */
  @Input({ required: true }) currentStatus!: string;

  /** Compact mode for grid usage (hides label and wrappers) */
  @Input() compact = false;

  /** Emitted when status is successfully updated */
  @Output() statusUpdated = new EventEmitter<TaskModel>();

  /** Emitted when an error occurs */
  @Output() statusUpdateError = new EventEmitter<Error>();

  /** Internal state */
  selectedStatus = signal<string>('');
  errorMessage = signal<string | null>(null);
  availableStatuses = Object.keys(STATUS_CONFIG) as TaskStatus[];

  /** Returns the display name for a status */
  getDisplayName(status: string): string {
    const config = getStatusConfig(status);
    return config?.displayName || status;
  }

  /** Returns the CSS class for a status */
  getStatusClass(status: string): string {
    const config = getStatusConfig(status);
    return config?.cssClass || '';
  }

  onStatusChange(newStatus: string) {
    if (newStatus === this.currentStatus) {
      return;
    }
    if (!isValidTaskStatus(newStatus)) {
      this.errorMessage.set('Invalid status selected.');
      this.selectedStatus.set(this.currentStatus);
      return;
    }
    this.selectedStatus.set(newStatus);
    this.errorMessage.set(null);
    this.taskService.updateTaskStatus(this.taskId, newStatus).subscribe({
      next: (updatedTask) => {
        this.statusUpdated.emit(updatedTask);
        this.taskService.notifyRefresh();
      },
      error: (error) => {
        this.selectedStatus.set(this.currentStatus);
        this.errorMessage.set('Failed to update status. Please try again.');
        this.statusUpdateError.emit(error);
      },
    });
  }

  ngOnInit() {
    this.selectedStatus.set(this.currentStatus);
  }

  ngOnChanges() {
    this.selectedStatus.set(this.currentStatus);
  }
}
