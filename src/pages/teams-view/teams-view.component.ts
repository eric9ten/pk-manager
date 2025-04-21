import { Component } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';

import { TTeam } from '../../types/team.type';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'pkm-teams-view',
  imports: [ CommonModule, MatTableModule],
  templateUrl: './teams-view.component.html',
  styleUrl: './teams-view.component.scss'
})

export class TeamsViewComponent {
  title = "Teams"
  private isLoggedIn = false
  currentUser: any;
  private userId!: string
  teamsOwned: TTeam[] = []
  public ownedDataSource = new MatTableDataSource<TTeam>()
  ownedDisplayColumns: string[] = ['name', 'ageGroup', 'genGroup', 'playerCount', 'coaches', 'arrow']
  loading = true
  error: any
  teamsCoached?: TTeam[]
  public coachedDataSource = new MatTableDataSource<TTeam>()
  coachedDisplayColumns: string[] = ['name', 'ageGroup', 'genGroup', 'playerCount', 'arrow']
  loadingCoached = true
  errorCoached: any
  checked = false

  constructor(
    // private tokenStorageService: TokenStorageService, 
    private teamService: TeamService, 
    // private fb: FormBuilder,
    // public dialog: MatDialog, 
    // private teamHelper: TeamHelper
  ) {
    this.isLoggedIn = true; //!!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      // this.currentUser = this.tokenStorageService.getUser()
      this.userId = '123456789' //this.currentUser.id
    }

  }

  ngOnInit(): void {
    console.log ("Loading Teams...")
    this.loadTeamsOwned();
    this.loadTeamsCoached();
    
  }

  clickTeam(team: TTeam) {
    // this.teamHelper.viewTeam(team)
    console.log('Viewing team:', team);

  }

  private loadTeamsCoached(): void {
    this.teamService.getTeamsManagedDigest(this.userId)
      .subscribe({
        next: (data) => {
          this.teamsCoached = data
          this.coachedDataSource = new MatTableDataSource(data)
          this.loadingCoached = false;
          console.log ("Teams Coached Loaded.")
        },
       error: (e) => console.log(e)
      })
  }

  private loadTeamsOwned(): void {
    this.teamService.getTeamsOwnedDigest(this.userId)
      .subscribe({
        next: (data) => {
          console.log('TEAMS: ', data)
          this.ownedDataSource = new MatTableDataSource(data);
          this.loading = false;

        },
        error: (e) => console.log(e)
      })
  }


}
