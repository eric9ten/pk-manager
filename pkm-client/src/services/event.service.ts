import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

import { TGame } from '@customTypes/game.type';
import { environment } from '@environments/environment';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly storageService = inject(TokenStorageService);
  private readonly http = inject(HttpClient);
    
  private readonly API_ROOT = `${environment.apiRoot}/games`;
  private gameCreatedSource = new Subject<void>();
  gameCreated$ = this.gameCreatedSource.asObservable();

  createGame(gameData: any): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    console.log('EventService: Sending POST to', this.API_ROOT, 'with data', gameData);
    return this.http.post(this.API_ROOT, gameData, { headers }).pipe(
      tap(data => {
        console.log('EventService: Game created', data);
        this.gameCreatedSource.next();
      })
    );
  }

  getAllGames(): Observable<TGame[]> {
    return this.http.get<TGame[]>(this.API_ROOT);
  }

  get(id: any): Observable<TGame> {
    return this.http.get<TGame>(`${this.API_ROOT}/${id}`);
  }
  
  getEventsByOwner(userId: any): Observable<TGame[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('EventService: Fetching games for user', userId);
    return this.http.get<TGame[]>(`${this.API_ROOT}/byowner/${userId}`, { headers });
  }
  
  getEventsByTeam(teamId: string): Observable<TGame[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('EventService: Fetching games for team', teamId);
    return this.http.get<TGame[]>(`${this.API_ROOT}/byteam/${teamId}`, { headers });
  }

  update(id: any, data: any): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.put(`${this.API_ROOT}/${id}`, data, { headers });
  }

  delete(id: any): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(`${this.API_ROOT}/${id}`, { headers });
  }

  deleteAll(): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete(this.API_ROOT, { headers });
  }
}