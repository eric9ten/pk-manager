import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TTeam } from '@customTypes/team.type';

import { teams } from '@assets/test-data/test-teams';

const baseUrl = 'https://api.example.com/TTeams'; // Replace with your actual API base URL

@Injectable({
  providedIn: 'root'
})

export class TeamService {

  constructor(private http: HttpClient) { }

  getAllEvents(): Observable<TTeam[]> {
    return of(teams); //this.http.get<TTeam[]>(baseUrl);
  }
  
  getByOwner(owner: any): Observable<TTeam[]> {
    return this.http.get<TTeam[]>(`${baseUrl}/byowner/${owner}`);
  }
  getForAllRoles(userId: any): Observable<TTeam[]> {
    return this.http.get<TTeam[]>(`${baseUrl}/byallroles/${userId}`);
  }

  getTeamsOwnedDigest(owner: string): Observable<TTeam[]> {
    return of(teams.filter((team) => team.owner.id === owner)); 
    //return this.http.get<TTeam[]>(`${baseUrl}/owneddigest/${owner}`);
  }

  getTeamsManagedDigest(manager: string): Observable<TTeam[]> {
    return of(teams.filter(team =>
      team.managers?.some(managerObj => managerObj.id === manager)
    ));
    
    // return this.http.get<TTeam[]>(`${baseUrl}/manageddigest/${manager}`);
  }

  // getTeam(id: any): Observable<TTeam> {
  //   return this.http.get(`${baseUrl}/${id}`);
  // }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }
  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }
  findByTitle(title: any): Observable<TTeam[]> {
    return this.http.get<TTeam[]>(`${baseUrl}?title=${title}`);
  }
}
