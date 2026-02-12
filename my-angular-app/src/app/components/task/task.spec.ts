import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TaskModel } from '../../types/TaskModel';

import { Task } from './task';

describe('Task', () => {
  let component: Task;
  let fixture: ComponentFixture<Task>;
  let httpMock: HttpTestingController;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Task],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'taskId' ? '1' : null),
              has: (key: string) => key === 'taskId',
            }),
          },
        },
        TaskService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(Task);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:8080/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);

    await fixture.whenStable();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
