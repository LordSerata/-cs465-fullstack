import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class Authentication {
  private storage = inject(BROWSER_STORAGE);
  private http = inject(HttpClient);
  private apiBaseUrl = 'http://localhost:3000/api/';
  private tokenKey = 'travlr-token';

  getToken(): string {
    return this.storage.getItem(this.tokenKey) ?? '';
  }

  saveToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
  }

  // Reads the middle part of the token (the payload) without calling the server
  private getPayload(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  // Logged in = we have a token and it hasn't expired yet
  isLoggedIn(): boolean {
    const payload = this.getPayload();
    return !!payload && payload.exp > Date.now() / 1000;
  }

  getCurrentUser(): User | null {
    if (!this.isLoggedIn()) {
      return null;
    }
    const { email, name } = this.getPayload();
    return { email, name } as User;
  }

  login(user: User, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}login`, { email: user.email, password })
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  register(user: User, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}register`, { name: user.name, email: user.email, password })
      .pipe(tap((response) => this.saveToken(response.token)));
  }
}
