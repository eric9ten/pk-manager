import { Component, inject } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { TTeam } from '../../types/team.type';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { ButtonIconComponent } from "../../components/buttons/button-icon/button-icon.component";
import { AddCircleIconComponent } from "../../assets/icons/add-circle-icon/add-circle-icon.component";
import { AddTeamFormComponent } from "../../components/add-team-form/add-team-form.component";

@Component({
  selector: 'pkm-teams-view',
  imports: [CommonModule, MatTableModule, ButtonIconComponent, AddCircleIconComponent, MatSidenavModule,
    ReactiveFormsModule, MatFormFieldModule, MatSlideToggleModule, AddTeamFormComponent],
  templateUrl: './teams-view.component.html',
  styleUrl: './teams-view.component.scss'
})

export class TeamsViewComponent {
  title = "Teams"
  currentUser: any;
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

  private isLoggedIn = false
  // private fb = inject(FormBuilder);
  private userId!: string

  // addTeamForm = this.fb.group ({
  //   name: ['', [Validators.required, Validators.minLength(4)]],
  //   abbrev: ['', [Validators.required, Validators.maxLength(4)]],
  //   ageGroup: ['', [Validators.required] ],
  //   colors: this.fb.group ({
  //     home: ['#000000'],
  //     away: ['#ffffff']
  //   }),
  //   genGroup: [''],
  //   owner: ['']

  // })

  constructor(
    // private tokenStorageService: TokenStorageService, 
    private teamService: TeamService,
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
