export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

interface StatusConfig {
  displayName: string;
  cssClass: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  [TaskStatus.TODO]: {
    displayName: 'To-Do',
    cssClass: 'status-todo',
    color: '#b8860b',
    backgroundColor: '#fffbe6',
    borderColor: '#ffe58f',
  },
  [TaskStatus.IN_PROGRESS]: {
    displayName: 'In Progress',
    cssClass: 'status-in-progress',
    color: '#096dd9',
    backgroundColor: '#e6f7ff',
    borderColor: '#91d5ff',
  },
  [TaskStatus.IN_REVIEW]: {
    displayName: 'In Review',
    cssClass: 'status-in-review',
    color: '#531dab',
    backgroundColor: '#f0f5ff',
    borderColor: '#adc6ff',
  },
  [TaskStatus.DONE]: {
    displayName: 'Done',
    cssClass: 'status-done',
    color: '#389e0d',
    backgroundColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  [TaskStatus.CANCELLED]: {
    displayName: 'Cancelled',
    cssClass: 'status-cancelled',
    color: '#cf1322',
    backgroundColor: '#fff1f0',
    borderColor: '#ffa39e',
  },
};

export function getStatusConfig(status: string): StatusConfig | null {
  return STATUS_CONFIG[status as TaskStatus] || null;
}

export function isValidTaskStatus(value: string): value is TaskStatus {
  return Object.values(TaskStatus).includes(value as TaskStatus);
}
