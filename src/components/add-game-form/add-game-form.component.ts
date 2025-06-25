import { Component, inject, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TTeam } from '@customTypes/team.type';
import { TUser } from '@customTypes/user.type';
import { startWith, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { TeamService } from '@services/team.service';

@Component({
  selector: 'pkm-add-game-form',
  imports: [CommonModule, MatAutocompleteModule, MatSlideToggleModule, MatFormFieldModule, ReactiveFormsModule, 
    ButtonStandardComponent, ButtonStandardComponent, MatInputModule
  ],
  templateUrl: './add-game-form.component.html',
  styleUrl: './add-game-form.component.scss'
})

export class AddGameFormComponent {
  private _snackBar = inject(MatSnackBar);
  
  teamsA!: TTeam[];
  teamsB!: TTeam[];
  filteredTeamsA!: Observable<TTeam[]>;
  filteredTeamsB!: Observable<TTeam[]>;
                          
  isLoggedIn = signal<boolean>(false);
  private currentUser!: TUser;
  private userId?: string;

  addGameForm: FormGroup;

  title = "Add Game";
  cmboPlaceholder = "Select a team...";
  fullDate: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private readonly teamService: TeamService,
    // private gameHelperService: GamesHelperService,
    // private tokenStorageService: TokenStorageService,
  ){
    
    this.isLoggedIn.set(true) //!!this.tokenStorageService.getToken();
    if (this.isLoggedIn()) {
    //   this.currentUser = this.tokenStorageService.getUser()
      this.userId = '123456789' //this.currentUser.id
    }
        
    this.addGameForm = fb.group({
      gameDate: ['', Validators.required],
      gameTime: [null],
      teamA: ['', Validators.required],
      teamB: ['', Validators.required],
      homeTeam: ['a'],
      location: [],
      gameType: [],
      owner: []
    })

  }

  ngOnInit(): void {
    console.log ('Loading all teams...')
    this.loadTeams();
  }

  displayFn(team: TTeam): string {
    return team && team.name ? team.name : '';
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.addGameForm.controls;
  }
    

  private loadTeams(): void {
     //getAllTeamsAllRolesForSelect(this.currentUser.id);

    this.teamService.getAllTeams().subscribe( (teams) => {
      this.teamsA = teams;
      this.teamsB = teams;
      this.filteredTeamsA = this.addGameForm.controls['teamA'].valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => {
          const filtered = name ? this._filterA(name) : this.teamsA.slice();
          const teamBValue = this.addGameForm.controls['teamB'].value;
          const filteredExcludingTeamB = teamBValue && teamBValue.id !== '00000000'
            ? filtered.filter(team => team.id !== teamBValue.id)
            : filtered;
          const sortedTeams = filteredExcludingTeamB.sort((a, b) => a.name.localeCompare(b.name));
          return [{ id: '00000000', name: 'TBD',  abbrev: 'TBD'}, ...sortedTeams];
        })
      )

      this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => {
          const filtered = name ? this._filterB(name) : this.teamsB.slice();
          const teamAValue = this.addGameForm.controls['teamB'].value;
          const filteredExcludingTeamA = teamAValue && teamAValue.id !== '00000000'
            ? filtered.filter(team => team.id !== teamAValue.id)
            : filtered;
          const sortedTeams = filteredExcludingTeamA.sort((a, b) => a.name.localeCompare(b.name));
          return [{ id: '00000000', name: 'TBD',  abbrev: 'TBD'}, ...sortedTeams];
        })
      )
    });

  }

  onHomeTeamChange($event: Event): void {
    const homeTeam = ($event.target as HTMLInputElement).value;
    this.addGameForm.patchValue({ homeTeam: homeTeam });
  }

  onSubmit() {
    this.addGameForm.patchValue({owner: this.userId})

    this._checkDateTime()
    this.addGameForm.patchValue({gameDate: this.fullDate})
    console.log('Form submitted with values:', this.addGameForm.value);
    // this.addGame()

    this._openSnackBar('Game Added', 'Close');

  }

  private _checkDateTime(): void {
    const gameDateControl = this.addGameForm.controls['gameDate'];
    const gameTimeControl = this.addGameForm.controls['gameTime'];

    if (!gameDateControl.value) {
      console.warn('No valid game date provided');
      return;
    }

    const dateParts = gameDateControl.value.split('-').map((part: string) => parseInt(part, 10));
    if (dateParts.length !== 3 || dateParts.some(isNaN)) {
      console.warn('Invalid date format:', gameDateControl.value);
      return;
    }

    let hour = 12;
    let minute = 0;
    let isPM = true;

    if (gameTimeControl.value) {
      console.log('Game time provided:', gameTimeControl.value);
      const timeParts = gameTimeControl.value.split(':').map((part: string) => parseInt(part, 10));
      if (timeParts.length >= 2 && !timeParts.some(isNaN)) {
        hour = timeParts[0];
        minute = timeParts[1];
      } else {
        console.warn('Invalid time format:', gameTimeControl.value);
        return;
      }
    }

    if (isPM && hour !== 12) {
      hour += 12;
    } else if (!isPM && hour === 12) {
      hour = 0;
    }

    const year = dateParts[0];
    const month = dateParts[1] - 1;
    const day = dateParts[2];

    try {
      const utcDate = Date.UTC(year, month, day, hour, minute);
      this.fullDate = new Date(utcDate).toISOString();
    } catch (error) {
      console.error('Error creating date:', error);
      this.fullDate = null;
    }
  }

  private _filterA(name: string ): TTeam[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsA.filter((team: TTeam) => team.name!.toLowerCase().includes(filterValue));
  }

  private _filterB(name: string ): TTeam[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsB.filter(team => team.name!.toLowerCase().includes(filterValue))
  }

  private _openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
