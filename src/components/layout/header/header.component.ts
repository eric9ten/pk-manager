import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pkm-header',
  imports: [ CommonModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public currentUser: any;
  public isLoggedIn = true;
  public isOpen = false;

}
