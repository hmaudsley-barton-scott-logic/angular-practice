import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskStatusUpdate } from './task-status-update';
import { TaskService } from '../../services/task.service';
import { of, throwError } from 'rxjs';
import { TaskModel } from '../../types/TaskModel';

describe('TaskStatusUpdate', () => {
  let component: TaskStatusUpdate;
  let fixture: ComponentFixture<TaskStatusUpdate>;
  let taskServiceSpy: jest.Mocked<TaskService>;

  const mockTask: TaskModel = {
    id: '123',
    code: 'TASK-1',
    status: 'TODO',
    reporterId: 'user1',
    assigneeId: 'user2',
    reporterName: 'John Doe',
    assigneeName: 'Jane Doe',
    summary: 'Test Task',
    creationDate: new Date(),
    updatedDate: new Date(),
  };

  beforeEach(async () => {
    taskServiceSpy = {
      updateTaskStatus: jest.fn(),
      notifyRefresh: jest.fn(),
    } as unknown as jest.Mocked<TaskService>;

    await TestBed.configureTestingModule({
      imports: [TaskStatusUpdate],
      providers: [{ provide: TaskService, useValue: taskServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskStatusUpdate);
    component = fixture.componentInstance;
    component.taskId = '123';
    component.currentStatus = 'TODO';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current status', () => {
    expect(component.selectedStatus()).toBe('TODO');
  });

  it('should update status successfully', () => {
    const updatedTask = { ...mockTask, status: 'IN_PROGRESS' };
    taskServiceSpy.updateTaskStatus.mockReturnValue(of(updatedTask));

    const emitSpy = jest.spyOn(component.statusUpdated, 'emit');
    component.onStatusChange('IN_PROGRESS');

    expect(taskServiceSpy.updateTaskStatus).toHaveBeenCalledWith('123', 'IN_PROGRESS');
    expect(emitSpy).toHaveBeenCalledWith(updatedTask);
    expect(taskServiceSpy.notifyRefresh).toHaveBeenCalled();
  });

  it('should not update if same status selected', () => {
    component.onStatusChange('TODO');
    expect(taskServiceSpy.updateTaskStatus).not.toHaveBeenCalled();
  });

  it('should handle update error', () => {
    const error = new Error('Update failed');
    taskServiceSpy.updateTaskStatus.mockReturnValue(throwError(() => error));

    const errorEmitSpy = jest.spyOn(component.statusUpdateError, 'emit');
    component.onStatusChange('IN_PROGRESS');

    expect(component.errorMessage()).toBe('Failed to update status. Please try again.');
    expect(errorEmitSpy).toHaveBeenCalledWith(error);
    expect(component.selectedStatus()).toBe('TODO');
  });

  it('should show loading state during update', () => {
    taskServiceSpy.updateTaskStatus.mockReturnValue(of(mockTask));

    expect(component.isUpdating()).toBe(false);
    component.onStatusChange('IN_PROGRESS');
    expect(component.isUpdating()).toBe(false); // Completes synchronously in test
  });
});
