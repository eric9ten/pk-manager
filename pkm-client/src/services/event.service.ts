import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { TGame } from '@customTypes/game.type';

import { games } from '@assets/test-data/test-games';

const baseUrl = 'http://localhost:8080/api/games';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private readonly http: HttpClient) { }
  
  getAllGames(): Observable<TGame[]> {
    // return this.http.get<TGame[]>(baseUrl);
    return of(games);
  }
  get(id: any): Observable<TGame> {
    return this.http.get<TGame>(`${baseUrl}/${id}`)
  }
  
  getEventsByOwner(userId: any): Observable<TGame[]> {
    return this.http.get<TGame[]>(`${baseUrl}/byowner/${userId}`)
  }
  
  getGamesByTeam(teamId: any): Observable<TGame[]> {
    return this.http.get<TGame[]>(`${baseUrl}/byteam/${teamId}`)
  }

  createGame(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data)
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`)
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl)
  }
}
