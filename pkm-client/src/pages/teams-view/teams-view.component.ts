import { Component, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';

import { TTeam } from '../../types/team.type';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { ButtonIconComponent } from "../../components/buttons/button-icon/button-icon.component";
import { AddCircleIconComponent } from "../../assets/icons/add-circle-icon/add-circle-icon.component";
import { AddTeamFormComponent } from "../../components/add-team-form/add-team-form.component";
import { TokenStorageService } from '@services/token-storage.service';

@Component({
  selector: 'pkm-teams-view',
  imports: [CommonModule, MatTableModule, ButtonIconComponent, AddCircleIconComponent, MatSidenavModule, AddTeamFormComponent,
    MatIconModule, MatSidenavModule
  ],
  templateUrl: './teams-view.component.html',
  styleUrl: './teams-view.component.scss'
})

export class TeamsViewComponent {
  private readonly teamService = inject(TeamService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = "Teams"
  currentUser: any;
  teamsOwned: TTeam[] = []
  ownedDataSource = new MatTableDataSource<TTeam>()
  ownedDisplayColumns: string[] = ['name', 'ageGroup', 'genGroup', 'playerCount', 'coaches', 'arrow']
  loading = true
  error: any
  teamsCoached?: TTeam[]
  coachedDataSource = new MatTableDataSource<TTeam>()
  coachedDisplayColumns: string[] = ['name', 'ageGroup', 'genGroup', 'playerCount', 'arrow']
  loadingCoached = true
  errorCoached: any
  checked = false


  isLoggedIn = signal<boolean>(false);
  private userId!: string

  constructor( ) {
    this.isLoggedIn.set(!!this.tokenStorageService.getToken());
    if (this.isLoggedIn()) {
      this.currentUser = this.tokenStorageService.getUser();
      this.userId = this.currentUser.id;
    }

  }

  ngOnInit(): void {
    console.log ("Loading Teams...");
    this.teamService.teamCreated$.subscribe(() => {
      console.log('TeamsViewComponent: Team created, refreshing owned teams');
      this.loadTeamsOwned();
    });
    this.teamService.getAllTeams().subscribe({
      next: (data) => {
        console.log('All Teams: ', data);
      },
      error: (e) => console.log(e)
    });
    this.loadTeamsOwned();
    this.loadTeamsCoached();
    
  }

  clickTeam(team: TTeam): void {
    console.log('Viewing team:', team);
    if (!team._id) {
      this.error = 'Cannot navigate to team details: Invalid team ID';
      console.error('TeamsViewComponent: Team _id is undefined', team);
      return;
    }
    this.router.navigate([this.userId, 'team', team._id]).then(success => {
      console.log('TeamsViewComponent: Navigation to team details', success ? 'succeeded' : 'failed', {
        teamId: team._id,
        currentRoute: this.route.snapshot.url,
      });
    });
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
