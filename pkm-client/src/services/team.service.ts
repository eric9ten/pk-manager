import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TTeam } from '@customTypes/team.type';

import { teams } from '@assets/test-data/test-teams';

const baseUrl = 'http://localhost:8080/api/teams';

@Injectable({
  providedIn: 'root'
})

export class TeamService {

  constructor(private http: HttpClient) { }

  getAllTeams(): Observable<TTeam[]> {
    this.http.get<TTeam[]>(baseUrl).subscribe({
      next: (data) => {
        console.log('All Teams from server: ', data);
      },
      error: (e) => console.log(e)
    });
    return this.http.get<TTeam[]>(baseUrl); //return of(teams); //
  }
  
  getByOwner(owner: any): Observable<TTeam[]> {
    return this.http.get<TTeam[]>(`${baseUrl}/byowner/${owner}`);
  }
  getForAllRoles(userId: any): Observable<TTeam[]> {
    return this.http.get<TTeam[]>(`${baseUrl}/byallroles/${userId}`);
  }

  getTeamsOwnedDigest(owner: string): Observable<TTeam[]> {
    // return of(teams.filter((team) => team.owner.id === owner)); 
    return this.http.get<TTeam[]>(`${baseUrl}/owneddigest/${owner}`);
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

  create(team: any): Observable<any> {
    console.log('Creating team:', team);
    return this.http.post(baseUrl, team);
  }
  update(id: any, team: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, team);
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
