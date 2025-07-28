import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { TTeam } from '@customTypes/team.type';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TeamService {
  private readonly storageService = inject(TokenStorageService);
  private readonly http = inject(HttpClient);

  private readonly API_ROOT = `${environment.apiRoot}/teams`;
  private readonly teamCreated = new Subject<void>(); // Notify team creation
  teamCreated$ = this.teamCreated.asObservable();

  private readonly commonAbbreviations: Set<string> = new Set([
    'FC', 'SC', 'AC', 'NE'
  ].map(abbrev => abbrev.toUpperCase()));

  constructor() { }
  
  notifyTeamCreated(): void {
    console.log('TeamService: Notifying team created');
    this.teamCreated.next();
  }
  
  getTeam(id: string): Observable<TTeam> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.API_ROOT}/team/${id}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam>(url, { headers });
  }

  getAllTeams(): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/all`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }

  getByOwner(owner: string): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/byowner/${owner}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }

  getForAllRoles(userId: string): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/byallroles/${userId}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }

  getTeamsOwnedDigest(ownerId: string): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/owneddigest/${ownerId}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }

  getTeamsManagedDigest(managerId: string): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/manageddigest/${managerId}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }

  createTeam(team: any): Observable<TTeam> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
      const url = `${this.API_ROOT}/`;
      console.log('TeamService: Sending POST to', url, 'with data', team);
    return this.http.post<TTeam>(url, team, { headers });
  }

  updateTeam(team: TTeam): Observable<TTeam> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const url = `${this.API_ROOT}/team/${team._id}`;
    console.log('TeamService: Sending PUT to', url);
    return this.http.put<TTeam>(url, team, { headers });
  }

  deleteTeam(id: string): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}/${id}`;
    console.log('TeamService: Sending DELETE to', url);
    return this.http.delete(url, { headers });
  }

  deleteAll(): Observable<any> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}`;
    console.log('TeamService: Sending DELETE to', url);
    return this.http.delete(url, { headers });
  }

  findByTitle(title: string): Observable<TTeam[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    const url = `${this.API_ROOT}?title=${title}`;
    console.log('TeamService: Sending GET to', url);
    return this.http.get<TTeam[]>(url, { headers });
  }
  
  getAbbreviation(name: string): string {
    let abbrev = '';
    let len = name.length;
    if (len > 0) {
      if (len < 3) {
        abbrev = name;
      } else {
        let hasSpaces: boolean = name.includes(' ');
        if (!hasSpaces) {
          abbrev = name.substring(0, Math.min(4, name.length));
        } else {
          let words = name.split(' ').filter(word => word.length > 0);
          if (words.length === 2) {
            const secondWord = words[1].toUpperCase();
            const secondPart = this.commonAbbreviations.has(secondWord) ? secondWord : words[1].charAt(0);
            abbrev = words[0].substring(0, Math.min(2, words[0].length)) + secondPart;
            // Ensure max 4 letters, keep common abbreviation if possible
            if (abbrev.length > 4 && this.commonAbbreviations.has(secondWord)) {
              abbrev = abbrev.substring(0, 2) + secondWord; // Keep first 2 letters + common abbrev
              if (abbrev.length > 4) {
                abbrev = abbrev.substring(0, 2) + secondWord.slice(0, 2); // Limit common abbrev to 2 letters
              }
            } else if (abbrev.length > 4) {
              abbrev = abbrev.substring(0, 4); // Simple trim to 4
            }
          } else {
            abbrev = words.map(word => {
              const upperWord = word.toUpperCase();
              return this.commonAbbreviations.has(upperWord) ? upperWord : word.charAt(0);
            }).join('');
            // Handle max 4 letters
            if (abbrev.length > 4) {
              const lastWord = words[words.length - 1].toUpperCase();
              if (this.commonAbbreviations.has(lastWord)) {
                const prefix = abbrev.substring(0, abbrev.length - lastWord.length);
                if (prefix.length >= 3) {
                  // Remove third letter, keep last two from common abbrev
                  abbrev = prefix.substring(0, 2) + lastWord.slice(0, 2);
                } else {
                  abbrev = prefix + lastWord.slice(0, 4 - prefix.length);
                }
              } else {
                abbrev = abbrev.substring(0, 4); // Simple trim to 4
              }
            }
          }
        }
      }
    }
    return abbrev.toUpperCase();
  }

}
