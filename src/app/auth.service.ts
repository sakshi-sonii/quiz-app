import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:5001/api/auth'; // Backend API URL
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        this.userRoleSubject.next(response.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userRoleSubject.next(null);
  }

  getRole(): string | null {
    return this.userRoleSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}