import { Component, Inject, signal, Signal } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { TGame } from '@customTypes/game.type';

import { TTeam } from '@customTypes/team.type';
import { TUser } from '@customTypes/user.type';
import { startWith, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pkm-add-event-form',
  imports: [ CommonModule, MatAutocompleteModule, MatSlideToggleModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './add-event-form.component.html',
  styleUrl: './add-event-form.component.scss'
})
export class AddEventFormComponent {
  
  teamsA!: TTeam[];
  teamsB!: TTeam[];
  filteredTeamsA = Observable<TTeam[]>;
  filteredTeamsB = Observable<TTeam[]>;
                          
  isLoggedIn = false
  currentUser!: TUser;
  userId?: string;

  addGameForm: FormGroup
  teamA = new FormControl()
  teamB = new FormControl()


  title: string
  cmboPlaceholder = "Select a team..."
  checked = false
  fullDate: string = ''

  constructor(
    private fb: FormBuilder, 
    // private gameHelperService: GamesHelperService,
    // private teamHelperService: TeamHelperService,
    // private tokenStorageService: TokenStorageService, 
    public dialog: MatDialog, 
    // @Inject(MAT_DIALOG_DATA) {teamA, teamB, homeTeam, gameDate, location, owner}: TGame 
  ){

    this.title = "Add Game"
        
    this.addGameForm = fb.group({
      gameDate: ['', Validators.required],
      gameTime: [],
      teamA: ['', Validators.required],
      teamAAbbrev: ['', [Validators.minLength(3), Validators.maxLength(4)]],
      homeTeam: [''],
      teamB: ['', Validators.required],
      teamBAbbrev: ['', [Validators.minLength(3), Validators.maxLength(4)]],
      location: [],
      owner: []
    })

    this.addGameForm.controls['teamA'].valueChanges.subscribe(
      selectedTeam => this.addGameForm.controls['teamAAbbrev'].setValue(selectedTeam.abbrev),
    )

    this.addGameForm.controls['teamB'].valueChanges.subscribe(
      selectedTeam => this.addGameForm.controls['teamBAbbrev'].setValue(selectedTeam.abbrev)
    )

  }

  ngOnInit(): void {
    // this.isLoggedIn = !!this.tokenStorageService.getToken();
    // if (this.isLoggedIn) {
    //   this.currentUser = this.tokenStorageService.getUser()
    //   this.userId = this.currentUser.id
    // }

    console.log ('Loading all teams...')
    this.loadTeams()

    if (this.teamsA && this.teamsB) {

      console.log ('Loading filtered teams...')
      // this.filteredTeamsA =  this.addGameForm.controls['teamA'].valueChanges.pipe(
      //   startWith(''),
      //   map(value => (typeof value === 'string' ? value : value.name)),
      //   map(name => (name ? this._filterA(name) : this.teamsA.slice())),
      // )

      // this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
      //   startWith(''),
      //   map(value => (typeof value === 'string' ? value : value.name)),
      //   map(name => (name ? this._filterB(name) : this.teamsB.slice())),
      // )

    }

  }

  // addGame(): void {
  //   let resp = this.gameHelperService.addGame(this.addGameForm.value)
  //   console.log ("The response is " )
  //   console.log (resp)

  // }

  private loadTeams(): void {
    console.log ('Loading teams...')
    // this.teamsB = this.teamsA = await this.teamHelperService.getAllTeamsAllRolesForSelect(this.currentUser.id)

    // this.filteredTeamsA = this.addGameForm.controls['teamA'].valueChanges.pipe(
    //   startWith(''),
    //   map(value => (typeof value === 'string' ? value : value.name)),
    //   map(name => (name ? this._filterA(name) : this.teamsA.slice())),
    // )

    // this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
    //   startWith(''),
    //   map(value => (typeof value === 'string' ? value : value.name)),
    //   map(name => (name ? this._filterB(name) : this.teamsB.slice())),
    // )


  }

  onHomeCheck($event: MatSlideToggleChange): void {
    const target = $event.checked                     
    this.checked = target
    const value = target === true ? 'a' : 'b'

    this.addGameForm.patchValue({homeTeam: value})

  }

  onSubmit() {
    this.addGameForm.patchValue({owner: this.userId})

    this._checkDateTime()
    console.log ("The full date is " + this.fullDate)
    this.addGameForm.patchValue({gameDate: this.fullDate})

    // this.addGame()

    // this.dialogRef.close();
    this.showDialog()

  }

  onClose() {
    // this.dialogRef.close();
  }

  displayFn(team: TTeam): string {
    return team && team.name ? team.name : '';
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.addGameForm.controls;
  }

  showDialog(){
    console.log ('Showing dialog...')
    // const dialogData = new MessageDialogModel('Game Added', 'A new game was added.')
    // const dialogRef = this.dialog.open(MessageDialogComponent, {
    //   maxWidth: '450px',
    //   height: '200px',
    //   data: dialogData
    // }); 
    // setTimeout(() => {
    //   dialogRef.close();
    // }, 10000);
  }

  private _checkDateTime() {

    if(this.addGameForm.controls['gameDate'] && this.addGameForm.controls['gameTime']) {
      var dateParts = this.addGameForm.controls['gameDate'].value.split('-');
      var timeParts = this.addGameForm.controls['gameTime'].value.split(':');

      if(dateParts && timeParts) {
          dateParts[1] -= 1;
          this.fullDate = new Date(Date.UTC.apply(undefined, dateParts.concat(timeParts))).toISOString();
      }
    }
  }

  private _filterA(name: string ): TTeam[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsA.filter(team => team.name!.toLowerCase().includes(filterValue))
  }

  private _filterB(name: string ): TTeam[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsB.filter(team => team.name!.toLowerCase().includes(filterValue))
  }

}
