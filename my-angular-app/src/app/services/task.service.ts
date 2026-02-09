import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { TaskModel } from '../types/TaskModel';
import { Observable } from 'rxjs/internal/Observable';

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
    return this.http.get<TaskModel[]>(this.tasksUrl);
  }

  notifyRefresh() {
    this.refreshSubject.next();
  }
}
