import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskPreview } from './task-preview';

describe('TaskPreview', () => {
  let component: TaskPreview;
  let fixture: ComponentFixture<TaskPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskPreview],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskPreview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('task', {
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
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
