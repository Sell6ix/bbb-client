import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';
import { User } from '../models/user.model';
import { AppType, Role } from '../models/enums';
import { environment } from '../../environments/environment'


const API_URL = environment.api;

@Injectable({ providedIn: 'root' })
export class ApiService {

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
  return this.http.get<User[]>(`${API_URL}/users`);
}

  getUsersByRole(role: Role): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/users?role=${role}`);
  }

  getTargeted(username: string) {
  return this.http.get<Application[]>(`${API_URL}/applications/targeting/${username}`);}

  login(username: string, password: string) {
    return this.http.post<{ access_token: string }>(
      `${API_URL}/auth/login`,
      { username, password }
    );
  }

  me(): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/me`);
  }
  getUser(username: string): Observable<User> {
    return this.http.get<User>(`${API_URL}/users/${username}`);
  }

  getMine(): Observable<Application[]> {
    return this.http.get<Application[]>(`${API_URL}/applications/mine`);
  }

  getAll(): Observable<Application[]> {
    return this.http.get<Application[]>(`${API_URL}/applications`);
  }

  createApplication(data: { targetUser: string; type: AppType }) {
    return this.http.post<Application>(`${API_URL}/applications`, data);
  }

  cancelApplication(id: number) {
  return this.http.patch(`/api/applications/${id}/cancel`, {});
}

  vote(id: number)   { return this.http.patch(`${API_URL}/applications/${id}/vote`,   {}); }
  unvote(id: number) { return this.http.patch(`${API_URL}/applications/${id}/unvote`, {}); }
  delete(id: number) { return this.http.delete(`${API_URL}/applications/${id}`); }

  voteApplication   = this.vote;
  unvoteApplication = this.unvote;
  deleteApplication = this.delete;
}
