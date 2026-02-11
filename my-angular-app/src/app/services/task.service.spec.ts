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
});
