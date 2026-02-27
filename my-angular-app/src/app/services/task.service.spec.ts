import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TaskModel } from '../types/TaskModel';

const serverUrl = `http://localhost:8080`;

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', () => {
    const mockTasks: TaskModel[] = [
      {
        id: '1',
        code: 'TASK-001',
        status: 'To-Do',
        reporterId: 'r1',
        assigneeId: 'a1',
        reporterName: 'Reporter',
        assigneeName: 'Assignee',
        summary: 'Test summary',
        details: 'Test details',
        creationDate: new Date(),
        updatedDate: new Date(),
        dueDate: new Date(),
      },
    ];
    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual(mockTasks);
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch a single task by id', () => {
    const mockTask: TaskModel = {
      id: '1',
      code: 'TASK-001',
      status: 'To-Do',
      reporterId: 'r1',
      assigneeId: 'a1',
      reporterName: 'Reporter',
      assigneeName: 'Assignee',
      summary: 'Test summary',
      details: 'Test details',
      creationDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(),
    };
    service.getTask('1').subscribe((task) => {
      expect(task).toEqual(mockTask);
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should handle error when fetching a single task by id', () => {
    service.getTask('1').subscribe((task) => {
      expect(task).toBeNull();
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks/1`);
    expect(req.request.method).toBe('GET');
    req.flush(null, { status: 404, statusText: 'Not Found' });
  });

  it('should return an empty array when getTasks fails', () => {
    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual([]);
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should create a new task', () => {
    const newTask = {
      summary: 'New Task',
      details: 'Task details',
      reporterId: 'r1',
      assigneeId: 'a1',
      dueDate: new Date().toISOString(),
    };
    const createdTask: TaskModel = {
      id: '2',
      code: 'TASK-002',
      status: 'To-Do',
      reporterId: 'r1',
      assigneeId: 'a1',
      reporterName: 'Reporter',
      assigneeName: 'Assignee',
      summary: newTask.summary,
      details: newTask.details,
      creationDate: new Date(),
      updatedDate: new Date(),
      dueDate: new Date(newTask.dueDate),
    };
    service.createTask(newTask).subscribe((task) => {
      expect(task).toEqual(createdTask);
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(createdTask);
  });

  it('should handle error when creating a new task', () => {
    const newTask = {
      summary: 'New Task',
      details: 'Task details',
      reporterId: 'r1',
      assigneeId: 'a1',
      dueDate: new Date().toISOString(),
    };
    service.createTask(newTask).subscribe({
      next: () => fail('Expected error, but got success response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Server Error');
      },
    });
    const req = httpMock.expectOne(`${serverUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 'u1', name: 'User One' },
      { id: 'u2', name: 'User Two' },
    ];
    service.getUsers().subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
    const req = httpMock.expectOne(`${serverUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should return an empty array when getUsers fails', () => {
    service.getUsers().subscribe((users) => {
      expect(users).toEqual([]);
    });
    const req = httpMock.expectOne(`${serverUrl}/users`);
    expect(req.request.method).toBe('GET');
    req.flush('Internal Server Error', { status: 500, statusText: 'Server Error' });
  });
});
