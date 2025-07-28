import { Component } from '@angular/core';
import { GamesCardComponent } from "@components/games/games-card/games-card.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { AddGameFormComponent } from "@components/add-game-form/add-game-form.component";

@Component({
  selector: 'app-dashboard',
  imports: [GamesCardComponent, MatSidenavModule, AddGameFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
