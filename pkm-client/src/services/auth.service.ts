import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

import { environment } from '../environments/environment';
import { TUser, TLoginResponse, TRegisterResponse } from '../types/user.type';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_API = `${environment.apiRoot}auth/`;
  
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<TLoginResponse> {
    return this.http.post<TLoginResponse>(`${this.AUTH_API}signin`, { email, password }, httpOptions).pipe(
      tap(response => {
        // Store token and user details in localStorage
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('user', JSON.stringify({
            id: response.id,
            email: response.email,
            roles: response.roles
          }));
        }
      })
    );
  }

  register(user: { first: string, last: string, email: string, password: string, roles?: string[] }): Observable<any> {
    console.log('Signup request:', user); // Debug
    return this.http.post(`${this.AUTH_API}signup`, user, httpOptions);
  }

  // register(user: TUser): Observable<TRegisterResponse> {
  //   console.log('Signup request:', user);
  //   return this.http.post<TRegisterResponse>(`${this.AUTH_API}signup`, user, httpOptions).pipe(
  //     catchError(err => {
  //       console.error('Signup error:', err);
  //       throw new Error(err.message || 'Error during registration: Unable to reach server');
  //     })
  //   );
  // }

  logout(): Observable<any> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    return this.http.post(`${this.AUTH_API}signout`, {}, httpOptions).pipe(
      catchError(err => {
        console.error('Logout error:', err);
        // Continue even if the backend request fails, as localStorage is cleared
        return of({ message: 'Client-side logout successful' });
      })
    );
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}