import { Component, Input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';

import { TGame } from '../../types/game.type';
import { TUser } from '@customTypes/user.type';
import { EventService } from '@services/event.service';
import { ButtonIconComponent } from '@components/buttons/button-icon/button-icon.component';
import { AddCircleIconComponent } from '@assets/icons/add-circle-icon/add-circle-icon.component';
import { AddGameFormComponent } from '../../components/add-game-form/add-game-form.component';
import { TokenStorageService } from '@services/token-storage.service';

@Component({
  selector: 'pkm-events-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonIconComponent,
    AddCircleIconComponent,
    MatTableModule,
    MatSidenavModule,
    AddGameFormComponent,
    MatIconModule
  ],
  templateUrl: './events-view.component.html',
  styleUrl: './events-view.component.scss',
})
export class EventsViewComponent implements OnInit, OnDestroy {
  @Input() teamId?: string;

  title = 'Events';
  isLoggedIn = signal<boolean>(true);
  currentUser: TUser | null = null;
  userId?: string;
  allGames: TGame[] = [];
  upcomingGames: TGame[] = [];
  upcomingDataSource = new MatTableDataSource<TGame>([]);
  upcomingDisplayColumns: string[] = ['date', 'time', 'name', 'location', 'type', 'typeDescription', 'arrow'];
  loadingUpcoming = signal<boolean>(false);
  upcomingError = signal<string | null>(null);
  recentGames: TGame[] = [];
  recentDataSource = new MatTableDataSource<TGame>([]);
  recentDisplayColumns: string[] = ['result', 'score', 'name', 'location', 'date', 'arrow'];
  loadingRecent = signal<boolean>(false);
  errorRecent = signal<string | null>(null);
  private gameCreatedSubscription: Subscription | null = null;

  constructor(
    private readonly tokenStorageService: TokenStorageService,
    private readonly eventService: EventService,
  ) {
    this.isLoggedIn.set(!!this.tokenStorageService.getToken());
    if (this.isLoggedIn()) {
      this.currentUser = this.tokenStorageService.getUser();
      this.userId = this.currentUser!.id;
    }
  }

  ngOnInit(): void {
    console.log('EventsViewComponent: Loading Games...');
    this.getAllGames();
    this.gameCreatedSubscription = this.eventService.gameCreated$.subscribe(() => {
      console.log('EventsViewComponent: Game created, refreshing games');
      this.getAllGames();
    });
  }

  ngOnDestroy(): void {
    if (this.gameCreatedSubscription) {
      this.gameCreatedSubscription.unsubscribe();
    }
  }

  private getAllGames(): void {
    this.loadingUpcoming.set(true);
    this.loadingRecent.set(true);
    const observable = this.teamId
      ? this.eventService.getEventsByTeam(this.teamId)
      : this.eventService.getEventsByOwner(this.userId!);
    observable.subscribe({
      next: (data) => {
        console.log('EventsViewComponent: Games fetched', data);
        this.allGames = data;
        this.loadUpcomingGames();
        this.loadRecentGames();
        this.loadingUpcoming.set(false);
        this.loadingRecent.set(false);
      },
      error: (e) => {
        const errorMsg = e.error?.message || 'Failed to load games';
        console.error('EventsViewComponent: Error loading games', e);
        this.upcomingError.set(errorMsg);
        this.errorRecent.set(errorMsg);
        this.loadingUpcoming.set(false);
        this.loadingRecent.set(false);
        this.allGames = [];
        this.upcomingGames = [];
        this.recentGames = [];
        this.upcomingDataSource.data = [];
        this.recentDataSource.data = [];
      },
    });
  }

  private loadUpcomingGames(): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    console.log('EventsViewComponent: Today normalized', today);
    this.upcomingGames = this.allGames
      .filter(ug => new Date(ug.gameDate).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
    this.upcomingDataSource.data = this.upcomingGames;
    console.log('EventsViewComponent: Upcoming games loaded', this.upcomingGames);
  }

  private loadRecentGames(): void {
    console.log('EventsViewComponent: Loading Recent Games...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.recentGames = this.allGames
      .filter(rg => new Date(rg.gameDate).getTime() < today.getTime())
      .sort((a, b) => new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime());
    console.log('TIME: ', )
    this.recentDataSource.data = this.recentGames;
    console.log('EventsViewComponent: Recent games loaded', this.recentGames);
  }
}