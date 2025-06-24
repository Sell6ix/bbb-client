import { Injectable, Signal, signal,computed } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { AppType } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _role = computed(() => this._user()?.role ?? 'BRO');
  private _user = signal<User | null>(null);

  token(): string | null {
    return this._token();
  }

  role()  { return this._role(); }

  user(): Signal<User | null> {
    return this._user;
  }

  constructor(private api: ApiService) {
    if (this._token()) {
      this.api.me().subscribe({ next: u => this._user.set(u), error: () => this.logout() });
    }
  }

  login(username: string, password: string) {
    return this.api.login(username, password).pipe(
      tap(res => {
        localStorage.setItem('token', res.access_token);
        this._token.set(res.access_token);
        this.api.me().subscribe(u => this._user.set(u));
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
  }

  hasRole(...roles: string[]): boolean {
  return roles.includes(this._role());
}

  isAdmin(): boolean {
    return this.role() === AppType.ADMIN;
  }

  isMember(): boolean {
    return this.role() === AppType.MEMBER;
  }
}
