import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenav } from '@angular/material/sidenav';
import { startWith, map, Observable, forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { TTeam } from '@customTypes/team.type';
import { TUser } from '@customTypes/user.type';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { TeamService } from '@services/team.service';
import { TokenStorageService } from '@services/token-storage.service';
import { EventService } from '@services/event.service';
import { ModalService } from '@services/modal.service';

@Component({
  selector: 'pkm-add-game-form',
  standalone: true,
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    ButtonStandardComponent,
    MatInputModule,
  ],
  templateUrl: './add-game-form.component.html',
  styleUrls: ['./add-game-form.component.scss'],
})
export class AddGameFormComponent {
  private readonly teamService = inject(TeamService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly eventService = inject(EventService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly modalService = inject(ModalService);
  private _snackBar = inject(MatSnackBar);

  @Input() sidenav!: MatSidenav;
  @Output() gameAdded = new EventEmitter<void>();

  addGameForm!: FormGroup;
  error = '';
  teamsA!: TTeam[];
  teamsB!: TTeam[];
  filteredTeamsA!: Observable<TTeam[]>;
  filteredTeamsB!: Observable<TTeam[]>;
  isLoggedIn = signal<boolean>(false);
  private currentUser!: TUser;
  private userId?: string;

  title = "Add Game";
  cmboPlaceholder = "Select a team...";
  fullDate: string | null = null;

  constructor() {
    if (!this.tokenStorageService.getToken()) {
      this.error = 'User not logged in';
      console.error('AddGameFormComponent: Not logged in');
      this.router.navigate(['/home']);
      return;
    } else {
      this.isLoggedIn.set(true);
      this.currentUser = this.tokenStorageService.getUser();
      this.userId = this.currentUser.id;
    }

    this.addGameForm = this.fb.group({
      gameDate: ['', Validators.required],
      gameTime: ['', Validators.required],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      homeTeam: ['a'],
      location: [],
      gameType: [],
      gameTypeDescription: [],
      teamAStats: [{goals: 0, passes: 0, shots: 0, tackles: 0, goalKicks: 0, cornerKicks: 0, fouls: 0, yellowCards: 0, redCards: 0}],
      teamBStats: [{goals: 0, passes: 0, shots: 0, tackles: 0, goalKicks: 0, cornerKicks: 0, fouls: 0, yellowCards: 0, redCards: 0}],
      owner: [],
    });
  }

  ngOnInit(): void {
    this.loadTeams();
  }

  displayFn(team: TTeam): string {
    return team && team.name ? team.name : '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.addGameForm.controls;
  }

  private loadTeams(): void {
    this.teamService.getAllTeams().subscribe({
      next: (teams) => {
        this.teamsA = teams;
        this.teamsB = teams;
        this.filteredTeamsA = this.addGameForm.controls['teamA'].valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : (value && value.name) || '')),
          map(name => {
            const filtered = name ? this._filterA(name) : this.teamsA.slice();
            const teamBValue = this.addGameForm.controls['teamB'].value;
            const filteredExcludingTeamB = teamBValue && teamBValue._id !== '00000000'
              ? filtered.filter(team => team._id !== teamBValue._id)
              : filtered;
            const sortedTeams = filteredExcludingTeamB.sort((a, b) => a.name.localeCompare(b.name));
            return [{ _id: '00000000', name: 'TBD', abbrev: 'TBD' }, ...sortedTeams];
          })
        );

        this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
          startWith(''),
          map(value => (typeof value === 'string' ? value : (value && value.name) || '')),
          map(name => {
            const filtered = name ? this._filterB(name) : this.teamsB.slice();
            const teamAValue = this.addGameForm.controls['teamA'].value;
            const filteredExcludingTeamA = teamAValue && teamAValue._id !== '00000000'
              ? filtered.filter(team => team._id !== teamAValue._id)
              : filtered;
            const sortedTeams = filteredExcludingTeamA.sort((a, b) => a.name.localeCompare(b.name));
            return [{ _id: '00000000', name: 'TBD', abbrev: 'TBD' }, ...sortedTeams];
          })
        );
      },
      error: (err) => {
        console.error('AddGameFormComponent: Error loading teams', err);
        this._openSnackBar('Failed to load teams', 'Close');
      },
    });
  }

  onHomeTeamChange($event: Event): void {
    const homeTeam = ($event.target as HTMLInputElement).value;
    this.addGameForm.patchValue({ homeTeam: homeTeam });
  }

  onSubmit(): void {
    console.log('AddGameFormComponent: Form time:', this.addGameForm.controls['gameTime'].value);
    this.checkDateTime();
    if (!this.addGameForm.valid || !this.fullDate) {
      console.warn('AddGameFormComponent: Form invalid or date missing', {
        formValid: this.addGameForm.valid,
        gameDate: this.addGameForm.controls['gameDate'].value,
        gameTime: this.addGameForm.controls['gameTime'].value,
        gameDateErrors: this.addGameForm.controls['gameDate'].errors,
        gameTimeErrors: this.addGameForm.controls['gameTime'].errors,
        fullDate: this.fullDate,
      });
      this._openSnackBar('Please fill in all required fields correctly', 'Close');
      return;
    }

    this.addGameForm.patchValue({ owner: this.userId, gameDate: this.fullDate });
    console.log('AddGameFormComponent: Form submitted with values:', this.addGameForm.value);
    this.addGame();
  }

  private addGame(): void {
    if (!this.userId) {
      console.error('AddGameFormComponent: User ID is not available, cannot create game');
      this._openSnackBar('Error: User not logged in', 'Close');
      return;
    }

    const teamAValue = this.addGameForm.value.teamA;
    const teamBValue = this.addGameForm.value.teamB;
    const teamA$ = this.resolveTeam(teamAValue);
    const teamB$ = this.resolveTeam(teamBValue);

    forkJoin([teamA$, teamB$]).subscribe({
      next: ([teamAId, teamBId]) => {
        const formValue = {
          ...this.addGameForm.value,
          owner: this.userId,
          teamA: teamAId,
          teamB: teamBId,
          teamAStats: this.addGameForm.value.teamAStats[0],
          teamBStats: this.addGameForm.value.teamBStats[0],
        };

        console.log('AddGameFormComponent: Sending game data', formValue);
        this.eventService.createGame(formValue).subscribe({
          next: (data) => {
            console.log('AddGameFormComponent: Game created', data);
            this._openSnackBar('Game created successfully', 'Close');
            this.addGameForm.reset({
              gameDate: '',
              gameTime: '',
              teamA: null,
              teamB: null,
              homeTeam: 'a',
              location: '',
              gameType: '',
              gameTypeDescription: '',
              teamAStats: {goals: 0, passes: 0, shots: 0, tackles: 0, goalKicks: 0, cornerKicks: 0, fouls: 0, yellowCards: 0, redCards: 0},
              teamBStats: {goals: 0, passes: 0, shots: 0, tackles: 0, goalKicks: 0, cornerKicks: 0, fouls: 0, yellowCards: 0, redCards: 0},
              owner: '',
            });
            this.gameAdded.emit();
            this.sidenav.close();
          },
          error: (error) => {
            console.error('AddGameFormComponent: Error creating game', error);
            this._openSnackBar('Error creating game: ' + error.error?.message, 'Close');
          },
        });
      },
      error: (err) => {
        console.error('AddGameFormComponent: Error resolving teams', err);
        this._openSnackBar('Error creating teams', 'Close');
      },
    });
  }

  private resolveTeam(teamValue: TTeam | string): Observable<string | null> {
    if (typeof teamValue !== 'string') {
      const teamId = teamValue._id === '00000000' ? null : teamValue._id;
      console.log('AddGameFormComponent: Resolved team ID', teamId, 'for', teamValue);
      return of(teamId!);
    }

    const existingTeam = this.teamsA.find(team => team.name.toLowerCase() === teamValue.toLowerCase());
    if (existingTeam) {
      console.log('AddGameFormComponent: Found existing team', existingTeam._id, 'for', teamValue);
      return of(existingTeam._id!);
    }

    const newTeam = {
      name: teamValue,
      abbrev: this.teamService.getAbbreviation(teamValue),
      ageGroup: 'Unknown',
      genGroup: 'Unknown',
      owner: this.userId,
    };

    console.log('AddGameFormComponent: Creating new team', newTeam);
    return this.teamService.createTeam(newTeam).pipe(
      map(team => {
        console.log('AddGameFormComponent: New team created', team);
        this.teamsA = [...this.teamsA, team];
        this.teamsB = [...this.teamsB, team];
        return team._id!;
      })
    );
  }

  private checkDateTime(): void {
    const gameDateControl = this.addGameForm.controls['gameDate'];
    const gameTimeControl = this.addGameForm.controls['gameTime'];

    if (!gameDateControl.value || !gameTimeControl.value) {
      console.warn('AddGameFormComponent: Missing date or time', {
        gameDate: gameDateControl.value,
        gameTime: gameTimeControl.value,
      });
      this.fullDate = null;
      return;
    }

    // Handle date input from <input type="date"> (YYYY-MM-DD)
    const dateParts = gameDateControl.value.split('-').map((part: string) => parseInt(part, 10));
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      console.warn('AddGameFormComponent: Invalid date format:', gameDateControl.value);
      this.fullDate = null;
      return;
    }

    // Parse time in 24-hour format (HH:mm)
    const timeMatch = gameTimeControl.value.match(/(\d{1,2}):(\d{2})/);
    if (!timeMatch) {
      console.warn('AddGameFormComponent: Invalid time format:', gameTimeControl.value);
      this.fullDate = null;
      return;
    }

    const [, hours, minutes] = timeMatch;
    let hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Validate hour and minute ranges
    if (hour > 23 || minute > 59) {
      console.warn('AddGameFormComponent: Invalid time values:', { hour, minute });
      this.fullDate = null;
      return;
    }

    // Convert to 12-hour format with AM/PM for gameTime
    const isPM = hour >= 12;
    const period = isPM ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const formattedGameTime = `${displayHour}:${minutes.padStart(2, '0')} ${period}`;
    this.addGameForm.patchValue({ gameTime: formattedGameTime });

    const year = dateParts[0];
    const month = dateParts[1] - 1; // JavaScript months are 0-based
    const day = dateParts[2];

    try {
      const localDate = new Date(year, month, day, hour, minute);
      if (isNaN(localDate.getTime())) {
        console.warn('AddGameFormComponent: Invalid date constructed:', { year, month, day, hour, minute });
        this.fullDate = null;
        return;
      }
      this.fullDate = localDate.toISOString();
      console.log('AddGameFormComponent: Constructed date:', this.fullDate, 'Local:', localDate.toLocaleString(), 'Formatted gameTime:', formattedGameTime);
    } catch (error) {
      console.error('AddGameFormComponent: Error creating date:', error);
      this.fullDate = null;
    }
  }

  private _filterA(name: string): TTeam[] {
    const filterValue = name ? name.toLowerCase() : '';
    return this.teamsA.filter((team: TTeam) => team.name!.toLowerCase().includes(filterValue));
  }

  private _filterB(name: string): TTeam[] {
    const filterValue = name ? name.toLowerCase() : '';
    return this.teamsB.filter(team => team.name!.toLowerCase().includes(filterValue));
  }

  private _openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}