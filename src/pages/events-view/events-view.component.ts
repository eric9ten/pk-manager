import { Component, Input, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TGame } from '../../types/game.type';
import { TUser } from '@customTypes/user.type';
import { EventService } from '@services/event.service';
import { CommonModule } from '@angular/common';
import { ButtonIconComponent } from '@components/buttons/button-icon/button-icon.component';
import { AddCircleIconComponent } from '@assets/icons/add-circle-icon/add-circle-icon.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AddEventFormComponent } from "../../components/add-event-form/add-event-form.component";

@Component({
  selector: 'pkm-events-view',
  imports: [CommonModule, ButtonIconComponent, AddCircleIconComponent, MatTableModule, MatSidenavModule, AddEventFormComponent],
  templateUrl: './events-view.component.html',
  styleUrl: './events-view.component.scss'
})
export class EventsViewComponent {
  @Input() teamId?: string;

  title = "Events"
  isLoggedIn = signal<boolean>(true)
  currentUser: TUser | null = null
  userId?: string
  allGames: TGame[] = []

  upcomingGames: TGame[] = []
  upcomingDataSource = new MatTableDataSource<TGame>()
  upcomingDisplayColumns: string[] = ['date', 'time', 'name', 'field', 'league', 'arrow']
  loadingUpcoming = signal<boolean>(false);
  upcomingError: any

  recentGames: TGame[] = []
  public recentDataSource = new MatTableDataSource<TGame>()
  recentDisplayColumns: string[] = ['result', 'score', 'name', 'field', 'date', 'arrow']
  loadingRecent = signal<boolean>(false);
  errorRecent: any
  checked = false

  teamAGoals = 0
  teamBGoals = 0
  
  constructor(
    // private readonly tokenStorageService: TokenStorageService, 
    private readonly eventService: EventService, 
    private fb: FormBuilder, 
    private dialog: MatDialog
  ) {
    this.isLoggedIn.set(true) //!!this.tokenStorageService.getToken();
    if (this.isLoggedIn()) {
    //   this.currentUser = this.tokenStorageService.getUser()
      this.userId = '123456789' //this.currentUser.id
    }

  }

  ngOnInit(): void {
    console.log ("Loading Games...")
    this.getAllGames();
    
  }

  onSubmit() {
    //this.addTeamForm.patchValue({owner: this.userId})
    //this.addTeam()

    //console.warn(this.addTeamForm.value);

  }

  private getAllGames(): void {
    this.eventService.getAllGames()
    // this.eventService.getEventsByOwner(this.userId)
      .subscribe({
        next:(data) => {
          this.allGames = data
          this.loadingUpcoming.set(false);
          console.log('ALL GAMES: ', this.allGames)
  
          this.loadUpcomingGames();
          this.loadRecentGames();
        }
      })
  }

  private loadUpcomingGames(): void {
    console.log("Loading Upcoming Games...")
    const today = new Date().getTime()
    const upcoming = this.allGames.filter(((ug) => {
      console.log('UPCOMING EVENTS: ', ug)
      return new Date(ug.gameDate).getTime() > today
    
    }))
    this.upcomingGames = upcoming.sort((a , b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime());
    this.upcomingDataSource = new MatTableDataSource(this.upcomingGames);

  }
  
  // private loadTeamsCoached(): void {
  //   this.teamService.getTeamsManagedDigest(this.userId)
  //     .subscribe({
  //       next: (data) => {
  //         this.teamsCoached = data
  //         this.coachedDataSource = new MatTableDataSource(data)
  //         this.loadingCoached = false;
  //         console.log ("Teams Coached Loaded.")
  //       },
  //      error: (e) => console.log(e)
  //     })
  // }

  loadRecentGames() {
    console.log("Loading Recent Games...")
    const today = new Date().getTime()
    const recent = this.allGames.filter(( function(rg) {
      return new Date(rg.gameDate).getTime() < today

    }))

    /*recent.forEach((g) => {
      console.log("The unsorted game date is: " + `${g.gameDate}`);
    });*/
    this.recentGames = recent.sort((g1 , g2) => new Date(g2.gameDate).getTime() - new Date(g1.gameDate).getTime())
    /*this.recentGames = recent.sort((g1 , g2) => {
      let g1d = new Date(g1.gameDate).getTime(),
          g2d = new Date(g2.gameDate).getTime()


      console.log("Game Date 1 is: " + g1d + " and game date 2 is " + g2d)
      console.log(g2d - g1d)

      return g2d - g1d
    })*/
    /*console.log("The recent games are....")
    this.recentGames.forEach((rg) => {
      console.log("The sorted game date is: " + `${rg.gameDate}`);
    });*/
    this.recentDataSource = new MatTableDataSource(this.recentGames)
    console.log("The recent games are: ", this.recentGames)
    this.loadingRecent.set(false);
  }

  addGame() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true
    dialogConfig.autoFocus = true
    dialogConfig.width = "90%"
    dialogConfig.height = "auto"
    dialogConfig.maxWidth = 900
    dialogConfig.minHeight = 450
    dialogConfig.panelClass = "pkmDialog"

    dialogConfig.data = {
        id: 1,
        //title: 'Angular For Beginners'
    };

    // this.dialog.open(AddGameDialogComponent, dialogConfig);
    
    //const dialogRef = this.dialog.open(AddGameDialogComponent, dialogConfig);

    /*dialogRef.afterClosed().subscribe(
        data => console.log("Dialog output:", data)
    ); */

  }
}
