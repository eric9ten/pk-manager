// frontend/src/app/components/login/login.component.ts
import { AfterViewInit, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '@services/modal.service';
import { StorageService } from '@services/storage.service';
import { ButtonStandardComponent } from '@components/buttons/button-standard/button-standard.component';
import { TLoginResponse } from '../../types/user.type';

@Component({
  selector: 'pkm-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonStandardComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private modalService = inject(ModalService);
  private storageService = inject(StorageService);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  isLoggedIn = signal<boolean>(false);
  isLoginFailed = signal<boolean>(false);
  errorMessage = signal<string>('');

  roles: string[] = [];

  ngAfterViewInit(): void {
    if (this.storageService.isLoggedIn()) {
      console.log('LOGIN: User is already logged in');
      this.isLoggedIn.set(true);
      this.roles = this.storageService.getUser()?.roles || [];
    } else {
      console.log('LOGIN: User is not logged in, initializing login component');
      this.isLoggedIn.set(false);
    }
  }

  ngOnDestroy(): void {
    console.log('LOGIN: Cleaning up login component');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')!.value as string;
      const password = this.loginForm.get('password')!.value as string;

      this.authService.login(email, password).subscribe({
        next: (data: TLoginResponse) => {
          this.storageService.saveToken(data.accessToken);
          this.storageService.saveUser({
            id: data.id,
            first: data.first,
            last: data.last,
            email: data.email,
            roles: data.roles
          });
          this.isLoggedIn.set(true);
          this.isLoginFailed.set(false);
          this.roles = data.roles;
          this.modalService.closeModal();
          this.router.navigate([`${data.id}/dashboard`]);
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error during login');
          this.isLoginFailed.set(true);
          this.isLoggedIn.set(false);
        }
      });
    }
  }
}