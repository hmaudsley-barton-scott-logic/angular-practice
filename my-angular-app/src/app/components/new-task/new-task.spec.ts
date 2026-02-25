import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { NewTask } from './new-task';
import { TaskService } from '../../services/task.service';
import { TaskModel } from '../../types/TaskModel';

const mockUsers = [
  { id: 'u1', userName: 'Alice' },
  { id: 'u2', userName: 'Bob' },
];

const mockCreatedTask: TaskModel = {
  id: 't1',
  code: 'TASK-001',
  status: 'TODO',
  reporterId: 'u1',
  assigneeId: 'u2',
  reporterName: 'Alice',
  assigneeName: 'Bob',
  summary: 'New task',
  creationDate: new Date(),
  updatedDate: new Date(),
};

describe('NewTask', () => {
  let component: NewTask;
  let fixture: ComponentFixture<NewTask>;
  let taskService: jest.Mocked<TaskService>;
  let router: Router;

  beforeEach(async () => {
    const taskServiceMock = {
      getUsers: jest.fn().mockReturnValue(of(mockUsers)),
      createTask: jest.fn().mockReturnValue(of(mockCreatedTask)),
      notifyRefresh: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NewTask, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: TaskService, useValue: taskServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewTask);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService) as jest.Mocked<TaskService>;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.taskForm.value).toEqual({
      summary: '',
      details: '',
      reporterId: '',
      assigneeId: '',
      dueDate: '',
    });
  });

  it('should mark form as invalid when required fields are empty', () => {
    expect(component.taskForm.valid).toBeFalsy();
  });

  it('should mark form as valid when required fields are filled', () => {
    component.taskForm.patchValue({
      summary: 'Test task',
      reporterId: 'u1',
      assigneeId: 'u2',
    });
    expect(component.taskForm.valid).toBeTruthy();
  });

  it('should not submit when form is invalid', () => {
    component.onSubmit();
    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it('should mark all fields as touched on invalid submit', () => {
    component.onSubmit();
    expect(component.taskForm.get('summary')?.touched).toBeTruthy();
    expect(component.taskForm.get('reporterId')?.touched).toBeTruthy();
    expect(component.taskForm.get('assigneeId')?.touched).toBeTruthy();
  });

  it('should call createTask and navigate on valid submit', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.taskForm.patchValue({
      summary: 'New task',
      reporterId: 'u1',
      assigneeId: 'u2',
    });

    component.onSubmit();

    expect(taskService.createTask).toHaveBeenCalledWith({
      summary: 'New task',
      details: undefined,
      reporterId: 'u1',
      assigneeId: 'u2',
      dueDate: undefined,
    });
    expect(taskService.notifyRefresh).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/tasks', 't1']);
  });

  it('should show error message on create failure', () => {
    taskService.createTask.mockReturnValue(throwError(() => new Error('Server error')));

    component.taskForm.patchValue({
      summary: 'New task',
      reporterId: 'u1',
      assigneeId: 'u2',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Failed to create task. Please try again.');
    expect(component.submitting).toBeFalsy();
  });

  it('should navigate to tasks on cancel', () => {
    const navigateSpy = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    component.onCancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/tasks']);
  });

  it('should load users on init', () => {
    fixture.detectChanges();
    expect(taskService.getUsers).toHaveBeenCalled();
  });
});
