import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, UserModel } from '../../services/task.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-task',
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './new-task.html',
  styleUrl: './new-task.css',
})
export class NewTask implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);

  users$!: Observable<UserModel[]>;
  submitting = false;
  errorMessage = '';

  taskForm: FormGroup = this.fb.group({
    summary: ['', [Validators.required, Validators.maxLength(200)]],
    details: [''],
    reporterId: ['', Validators.required],
    assigneeId: [''],
    dueDate: [''],
  });

  ngOnInit(): void {
    this.users$ = this.taskService.getUsers();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';

    const formValue = this.taskForm.value;
    const assigneeId = formValue.assigneeId || '2c9f1e5a-8b3d-4f1a-9c2e-5d6f7a8b9c0d'; // Default to "Unassigned" user

    this.taskService
      .createTask({
        summary: formValue.summary,
        details: formValue.details || undefined,
        reporterId: formValue.reporterId,
        assigneeId: assigneeId,
        dueDate: formValue.dueDate || undefined,
      })
      .subscribe({
        next: (created) => {
          this.taskService.notifyRefresh();
          this.router.navigate(['/tasks', created.id]);
        },
        error: () => {
          this.submitting = false;
          this.errorMessage = 'Failed to create task. Please try again.';
        },
      });
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
