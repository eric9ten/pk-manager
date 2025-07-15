import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { TUser } from '@customTypes/user.type';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@services/auth.service';
import { ModalService } from '@services/modal.service';
import { StorageService } from '@services/storage.service';

@Component({
  selector: 'pkm-header',
  imports: [ CommonModule, RouterModule, RouterLink, RouterLinkActive, MatIconModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  private modalService = inject(ModalService);
  private authService = inject(AuthService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private loginStateSubscription: Subscription | null = null;

  readonly currentUser = signal<TUser | null>(this.storageService.getUser());
  isOpen = false;
  isLoggedIn = signal<boolean>(false);
  userId: string | null = null;


  ngOnInit(): void {
    this.isLoggedIn.set(this.storageService.isLoggedIn());
    this.currentUser.set(this.storageService.getUser());
    console.log('Header init - isLoggedIn:', this.isLoggedIn(), 'currentUser:', this.currentUser());
    this.loginStateSubscription = this.storageService.getLoginState().subscribe(isLoggedIn => {
      this.isLoggedIn.set(isLoggedIn);
      this.currentUser.set(this.storageService.getUser());
      this.userId = this.currentUser()?.id || null;
      console.log('Header login state update - isLoggedIn:', isLoggedIn, 'currentUser:', this.currentUser());
    });

    console.log('USER ID:', this.userId);
  }

  ngOnDestroy(): void {
    if (this.loginStateSubscription) {
      this.loginStateSubscription.unsubscribe();
    }
  }

  onSignupClick(): void {
    this.modalService.openModal();
  }

  onLoginClick(): void {
    this.modalService.openLoginModal();
  }

  onLogoutClick(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.isLoggedIn.set(this.storageService.isLoggedIn());
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Logout error:', err);
        this.storageService.clean();
        this.isLoggedIn.set(this.storageService.isLoggedIn());
        this.router.navigate(['/']);
      }
    });
  }

  testNavigation(): void {
    this.router.navigate(['68718494c4737e658b2ffedb/teams']);
    console.log('Test navigation to /68718494c4737e658b2ffedb/teams');
  }

}
