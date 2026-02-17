import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TaskStatusUpdate } from './task-status-update';
import { TaskService } from '../../services/task.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskModel } from '../../types/TaskModel';

describe('TaskStatusUpdate', () => {
  let component: TaskStatusUpdate;
  let fixture: ComponentFixture<TaskStatusUpdate>;
  let httpMock: HttpTestingController;
  let taskService: TaskService;

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
    await TestBed.configureTestingModule({
      imports: [TaskStatusUpdate],
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    taskService = TestBed.inject(TaskService);

    fixture = TestBed.createComponent(TaskStatusUpdate);
    component = fixture.componentInstance;
    component.taskId = '123';
    component.currentStatus = 'TODO';
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with current status', () => {
    expect(component.selectedStatus()).toBe('TODO');
  });

  it('should update status successfully', fakeAsync(() => {
    const updatedTask = { ...mockTask, status: 'IN_PROGRESS' };
    const emitSpy = jest.spyOn(component.statusUpdated, 'emit');
    const notifySpy = jest.spyOn(taskService, 'notifyRefresh');

    component.onStatusChange('IN_PROGRESS');

    const req = httpMock.expectOne('http://localhost:8080/tasks/123/status');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ status: 'IN_PROGRESS' });

    req.flush(updatedTask);

    tick(10000);

    expect(emitSpy).toHaveBeenCalledWith(updatedTask);
    expect(notifySpy).toHaveBeenCalled();
  }));

  it('should not update if same status selected', () => {
    component.onStatusChange('TODO');
    httpMock.expectNone('http://localhost:8080/tasks/123/status');
  });

  it('should handle update error', fakeAsync(() => {
    const errorEmitSpy = jest.spyOn(component.statusUpdateError, 'emit');

    component.onStatusChange('IN_PROGRESS');

    const req = httpMock.expectOne('http://localhost:8080/tasks/123/status');
    expect(req.request.method).toBe('PATCH');

    req.error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    tick(10000);

    expect(component.errorMessage()).toBe('Failed to update status. Please try again.');
    expect(errorEmitSpy).toHaveBeenCalled();
    expect(component.selectedStatus()).toBe('TODO');
  }));

  it('should reject invalid status', () => {
    component.onStatusChange('INVALID_STATUS');

    expect(component.errorMessage()).toBe('Invalid status selected.');
    expect(component.selectedStatus()).toBe('TODO');
    httpMock.expectNone('http://localhost:8080/tasks/123/status');
  });

  it('should return display name for valid status', () => {
    expect(component.getDisplayName('TODO')).toBe('To-Do');
    expect(component.getDisplayName('IN_PROGRESS')).toBe('In Progress');
  });

  it('should return CSS class for valid status', () => {
    expect(component.getStatusClass('TODO')).toBe('status-todo');
    expect(component.getStatusClass('IN_PROGRESS')).toBe('status-in-progress');
  });

  it('should update selected status on ngOnChanges', () => {
    component.currentStatus = 'IN_PROGRESS';
    component.ngOnChanges();
    expect(component.selectedStatus()).toBe('IN_PROGRESS');
  });
});
