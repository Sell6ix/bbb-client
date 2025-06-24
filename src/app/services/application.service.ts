import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppType } from '../models/enums';
import { Application } from '../models/application.model';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private baseUrl = '/applications';

  constructor(private http: HttpClient) {}

  create(data: { targetUser: string; type: AppType }): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}`, data);
  }
} 