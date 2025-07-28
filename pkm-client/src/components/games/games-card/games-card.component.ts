import { Component, inject, Input, output, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { catchError, forkJoin, map, Observable, of, Subscription } from 'rxjs';

import { EventService } from '@services/event.service';
import { TeamService } from '@services/team.service';
import { TGame } from '@customTypes/game.type';
import { TUser } from '@customTypes/user.type';
import { StorageService } from '@services/storage.service';
import { TokenStorageService } from '@services/token-storage.service';
import { ButtonStandardComponent } from '@components/buttons/button-standard/button-standard.component';

interface DisplayGame {
  _id: string;
  teamAName: string;
  teamBName: string;
  gameDate: Date;
  homeTeam: string;
  teamAGoals?: number;
  teamBGoals?: number;
  location?: string;
}

@Component({
  selector: 'pkm-games-card',
  standalone: true,
  imports: [CommonModule, ButtonStandardComponent, RouterLink, MatIconModule],
  templateUrl: './games-card.component.html',
  styleUrls: ['./games-card.component.scss'],
})
export class GamesCardComponent implements OnInit, OnDestroy {
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly eventService = inject(EventService);
  private readonly storageService = inject(StorageService);
  private readonly teamService = inject(TeamService);

  @Input() teamId = '';
  @Input() isOnDash = false;

  addGameEvent = output<void>();

  title = 'Event';
  isLoggedIn = signal<boolean>(false);
  userId: string | null = null;
  allGames: TGame[] = [];
  upcomingGames: DisplayGame[] = [];
  recentGames: DisplayGame[] = [];
  isLoading = signal<boolean>(true);
  error: string | null = null;
  teamAGoals = 0;
  teamBGoals = 0;
  readonly currentUser = signal<TUser | null>(this.storageService.getUser());
  private loginStateSubscription: Subscription | null = null;
  private gameCreatedSubscription: Subscription | null = null;

  constructor() {
    this.isLoggedIn.set(this.storageService.isLoggedIn());
    this.currentUser.set(this.storageService.getUser());
    this.loginStateSubscription = this.storageService.getLoginState().subscribe(isLoggedIn => {
      this.isLoggedIn.set(isLoggedIn);
      this.currentUser.set(this.storageService.getUser());
      this.userId = this.currentUser()?.id || null;
    });
  }

  ngOnInit(): void {
    this.getAllGames();
    this.gameCreatedSubscription = this.eventService.gameCreated$.subscribe(() => {
      console.log('GamesCardComponent: Game created, refreshing games');
      this.getAllGames();
    });
  }

  ngOnDestroy(): void {
    if (this.loginStateSubscription) {
      this.loginStateSubscription.unsubscribe();
    }
    if (this.gameCreatedSubscription) {
      this.gameCreatedSubscription.unsubscribe();
    }
  }

  onAddGameClick(): void {
    this.addGameEvent.emit();
  }

  private getAllGames(): void {
    this.isLoading.set(true);
    const observable = this.isOnDash
      ? this.eventService.getEventsByOwner(this.userId!)
      : this.eventService.getEventsByTeam(this.teamId);
    observable.subscribe({
      next: (data) => {
        console.log('GamesCardComponent: Games fetched', data);
        this.allGames = data;
        this.isLoading.set(false);
        this.loadTeamNames();
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to load games';
        this.isLoading.set(false);
        console.error('GamesCardComponent: Error loading games', e);
      },
    });
  }

  private loadTeamNames(): void {
    if (!this.allGames || this.allGames.length === 0) {
      this.upcomingGames = [];
      this.recentGames = [];
      return;
    }

    const teamRequests: Observable<{ id: string; name: string }>[] = [];
    const uniqueTeamIds = new Set<string>();

    this.allGames.forEach(game => {
      if (game.teamA && game.teamA !== '00000000') uniqueTeamIds.add(game.teamA);
      if (game.teamB && game.teamB !== '00000000') uniqueTeamIds.add(game.teamB);
    });

    uniqueTeamIds.forEach(teamId => {
      teamRequests.push(
        this.teamService.getTeam(teamId).pipe(
          map(team => ({ id: teamId, name: team.name })),
          catchError(err => {
            console.error(`GamesCardComponent: Error fetching team ${teamId}:`, err);
            return of({ id: teamId, name: 'Unknown' });
          })
        )
      );
    });

    // Fetch all team names concurrently
    forkJoin(teamRequests).subscribe({
      next: (teamResults) => {
        const teamMap = new Map<string, string>(teamResults.map(result => [result.id, result.name]));
        const displayGames = this.allGames.map(game => ({
          _id: game._id,
          teamAName: teamMap.get(game.teamA!) || 'TBD',
          teamBName: teamMap.get(game.teamB!) || 'TBD',
          gameDate: new Date(game.gameDate),
          homeTeam: game.homeTeam!,
          teamAGoals: game.teamAStats?.goals,
          teamBGoals: game.teamBStats?.goals,
          location: game.location,
        }));

        // Split into upcoming and recent games
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for consistent comparison
        console.log('GamesCardComponent: Today normalized', today);
        this.upcomingGames = displayGames
          .filter(game => new Date(game.gameDate).getTime() >= today.getTime())
          .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
        this.recentGames = displayGames
          .filter(game => new Date(game.gameDate).getTime() < today.getTime())
          .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());

        console.log('GamesCardComponent: Display games loaded', {
          upcomingGames: this.upcomingGames,
          recentGames: this.recentGames,
        });
      },
      error: (err) => {
        this.error = 'Failed to load team names';
        console.error('GamesCardComponent: Error loading team names', err);
        this.upcomingGames = [];
        this.recentGames = [];
      },
    });
  }

  loadUpcomingGames(): void {
    console.log('GamesCardComponent: Loading Upcoming Games...');
    // Handled in loadTeamNames
  }

  loadRecentGames(): void {
    console.log('GamesCardComponent: Loading Recent Games...');
    // Handled in loadTeamNames
  }
}