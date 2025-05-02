import { Component, Input, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { TGame } from '../../types/game.type';
import { TUser } from '@customTypes/user.type';
import { GameService } from '@services/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pkm-games-view',
  imports: [ CommonModule],
  templateUrl: './games-view.component.html',
  styleUrl: './games-view.component.scss'
})
export class GamesViewComponent {
  @Input() teamId?: string;

  title = "Games"
  isLoggedIn = signal<boolean>(true)
  currentUser: TUser | null = null
  userId?: string
  allGames: TGame[] = []

  upcomingGames: TGame[] = []
  public upcomingDataSource = new MatTableDataSource<TGame>()
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
    private readonly gameService: GameService, 
    private fb: FormBuilder, 
    private dialog: MatDialog
  ) {
    // this.isLoggedIn = !!this.tokenStorageService.getToken();
    // if (this.isLoggedIn) {
    //   this.currentUser = this.tokenStorageService.getUser()
    //   this.userId = this.currentUser.id
    // }

  }

  onSubmit() {
    //this.addTeamForm.patchValue({owner: this.userId})
    //this.addTeam()

    //console.warn(this.addTeamForm.value);

  }

  ngOnInit(): void {
    console.log ("Loading Games...")
    this.getAllGames()
    
  }

  getAllGames(){
    this.gameService.getGamesByOwner(this.userId)
      .subscribe({
        next:(data) => {
          this.allGames = data
          this.loadingUpcoming.set(false);
          console.log('ALL GAMES: ', this.allGames)
  
          // this.loadUpcomingGames()
          // this.loadRecentGames()
        }
      })

  }

  loadUpcomingGames() {
    console.log("Loading Upcoming Games...")
    const today = new Date().getTime()
    const upcoming = this.allGames.filter(( function(ug) {
      return new Date(ug.gameDate).getTime() > today
    
    }))

    this.upcomingGames = upcoming.sort((a , b) => new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime())

    this.upcomingDataSource = new MatTableDataSource(this.upcomingGames)
  }

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
