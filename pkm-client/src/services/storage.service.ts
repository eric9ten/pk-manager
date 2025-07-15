import { Injectable, signal, Signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const USER_KEY = 'auth-user';
const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private loginState = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor() {
      // Initialize login state
      this.loginState.next(this.isLoggedIn());
    }

  getLoginState(): Observable<boolean> {
    return this.loginState.asObservable();
  }

  get isUserLoggedIn(): Signal<boolean> {
    return signal<boolean>(this.isLoggedIn());
  }
  
  clean(): void {
    window.sessionStorage.clear();
    this.loginState.next(false);
  }

  saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.loginState.next(true);
  }

  saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.loginState.next(true);
  }

  getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!window.sessionStorage.getItem(TOKEN_KEY) && !!window.sessionStorage.getItem(USER_KEY);
  }
}
