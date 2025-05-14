import { Component, Signal } from '@angular/core';

import { TTeam } from '@customTypes/team.type';

@Component({
  selector: 'pkm-add-event-form',
  imports: [],
  templateUrl: './add-event-form.component.html',
  styleUrl: './add-event-form.component.scss'
})
export class AddEventFormComponent {
  
  teamsA!: TTeam[]
  teamsB!: TTeam[]
  filteredTeamsA!: Observable<Team[]>
  filteredTeamsB!: Observable<Team[]>
                          
  isLoggedIn = false
  currentUser: any
  userId?: any

  addGameForm: FormGroup
  teamA = new FormControl()
  teamB = new FormControl()


  title: string
  cmboPlaceholder = "Select a team..."
  checked = false
  fullDate: string = ''

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddGameDialogComponent>, private gameHelperService: GamesHelperService,
    private teamHelperService: TeamHelperService, private tokenStorageService: TokenStorageService, public dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) {teamA, teamB, homeTeam, gameDate, location, owner}: IGame ){

    this.title = "Add Game"
        
    this.addGameForm = fb.group({
      gameDate: [gameDate, Validators.required],
      gameTime: [],
      teamA: [teamA, Validators.required],
      teamAAbbrev: ['', [Validators.minLength(3), Validators.maxLength(4)]],
      homeTeam: [homeTeam],
      teamB: [teamB, Validators.required],
      teamBAbbrev: ['', [Validators.minLength(3), Validators.maxLength(4)]],
      location: [location],
      owner: [owner]
    })

    this.addGameForm.controls['teamA'].valueChanges.subscribe(
      selectedTeam => this.addGameForm.controls['teamAAbbrev'].setValue(selectedTeam.abbrev),
    )

    this.addGameForm.controls['teamB'].valueChanges.subscribe(
      selectedTeam => this.addGameForm.controls['teamBAbbrev'].setValue(selectedTeam.abbrev)
    )

  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      this.currentUser = this.tokenStorageService.getUser()
      this.userId = this.currentUser.id
    }

    console.log ('Loading all teams...')
    this.loadTeams()

    if (this.teamsA && this.teamsB) {

      console.log ('Loading filtered teams...')
      this.filteredTeamsA =  this.addGameForm.controls['teamA'].valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this._filterA(name) : this.teamsA.slice())),
      )

      this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
        startWith(''),
        map(value => (typeof value === 'string' ? value : value.name)),
        map(name => (name ? this._filterB(name) : this.teamsB.slice())),
      )

    }

  }

  addGame(): void {
    let resp = this.gameHelperService.addGame(this.addGameForm.value)
    console.log ("The response is " )
    console.log (resp)

  }

  async loadTeams() {
    this.teamsB = this.teamsA = await this.teamHelperService.getAllTeamsAllRolesForSelect(this.currentUser.id)

    this.filteredTeamsA = this.addGameForm.controls['teamA'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filterA(name) : this.teamsA.slice())),
    )

    this.filteredTeamsB = this.addGameForm.controls['teamB'].valueChanges.pipe(
      startWith(''),
      map(value => (typeof value === 'string' ? value : value.name)),
      map(name => (name ? this._filterB(name) : this.teamsB.slice())),
    )


  }

  onHomeCheck($event: MatSlideToggleChange) {
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

    this.addGame()

    this.dialogRef.close();
    this.showDialog()

  }

  onClose() {
    this.dialogRef.close();
  }

  displayFn(team: Team): string {
    return team && team.name ? team.name : '';
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.addGameForm.controls;
  }

  showDialog(){
    const dialogData = new MessageDialogModel('Game Added', 'A new game was added.')
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      maxWidth: '450px',
      height: '200px',
      data: dialogData
    }); 
    setTimeout(() => {
      dialogRef.close();
    }, 10000);
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

  private _filterA(name: string ): Team[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsA.filter(team => team.name!.toLowerCase().includes(filterValue))
  }

  private _filterB(name: string ): Team[] {
    const filterValue = name ? name.toLowerCase() : ''

    return this.teamsB.filter(team => team.name!.toLowerCase().includes(filterValue))
  }

}
