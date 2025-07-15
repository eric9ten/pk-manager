import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_ROOT = environment.apiRoot;
  private currentId: string | null = null;

  constructor(private http: HttpClient) { }

  get currentUserId(): string | null {
    return this.currentId;
  }

  set currentUserId(userId: string) {
    this.currentId = userId;
  }

  getPublicContent(): Observable<any> {
    return this.http.get(this.API_ROOT + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(this.API_ROOT + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(this.API_ROOT + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.API_ROOT + 'admin', { responseType: 'text' });
  }
}

