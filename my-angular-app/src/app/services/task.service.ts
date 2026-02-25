import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { TaskModel } from '../types/TaskModel';
import { Observable, catchError, of, delay } from 'rxjs';
import { TaskStatus } from '../types/TaskStatus';

const serverUrl = `http://localhost:8080`;

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private refreshSubject = new Subject<void>();
  public refresh$ = this.refreshSubject.asObservable();
  private http = inject(HttpClient);

  private taskUrl(id: string) {
    return `${serverUrl}/tasks/${id}`;
  }

  private tasksUrl = `${serverUrl}/tasks`;

  getTasks(): Observable<TaskModel[]> {
    return this.http.get<TaskModel[]>(this.tasksUrl).pipe(
      catchError((error) => {
        console.error('Error loading tasks:', error);
        return of([]);
      }),
    );
  }

  getTask(id: string): Observable<TaskModel | null> {
    return this.http.get<TaskModel>(this.taskUrl(id)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }
        throw error;
      }),
    );
  }

  /**
   * Updates the status of a task.
   * @param id - The task ID
   * @param status - The new status value
   * @returns Observable of the updated task
   */
  updateTaskStatus(id: string, status: TaskStatus): Observable<TaskModel> {
    return this.http.patch<TaskModel>(`${this.taskUrl(id)}/status`, { status }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating task status:', error);
        throw error;
      }),
      delay(10000), // Simulate network delay for better UX testing
    );
  }

  createTask(task: CreateTaskRequest): Observable<TaskModel> {
    return this.http.post<TaskModel>(this.tasksUrl, task).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating task:', error);
        throw error;
      }),
    );
  }

  getUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${serverUrl}/users`).pipe(
      catchError((error) => {
        console.error('Error loading users:', error);
        return of([]);
      }),
    );
  }

  notifyRefresh() {
    this.refreshSubject.next();
  }
}

export interface CreateTaskRequest {
  summary: string;
  details?: string;
  reporterId: string;
  assigneeId: string;
  dueDate?: string;
}

export interface UserModel {
  id: string;
  userName: string;
}
