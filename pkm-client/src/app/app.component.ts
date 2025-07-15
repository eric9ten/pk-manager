import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';
import { HeaderComponent } from '../components/layout/header/header.component';
import { FooterComponent } from '../components/layout/footer/footer.component';
import { ModalComponent } from '../components/modal/modal.component';
import { ModalService } from '@services/modal.service';
import { RegisterComponent } from '../components/register/register.component';
import { LoginComponent } from "../components/login/login.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ModalComponent, RegisterComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private storageService = inject(StorageService);
  private authService = inject(AuthService);
  
  modalService = inject(ModalService);

  readonly title = 'PitchKeeper Manager';
  isLoggedIn = signal<boolean>(false);
  showAdminBoard = false;
  email?: string;

  private roles: string[] = [];

  ngOnInit(): void {
    this.isLoggedIn.set(this.storageService.isLoggedIn());

    if (this.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.email = user.email;
    }
  }
}