import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { ModalService } from '@services/modal.service';
import { TRegisterResponse, TUser } from '@customTypes/user.type';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'pkm-register',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonStandardComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private modalService = inject(ModalService);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private userService = inject(UserService);

  registerForm = this.fb.group({
    first: ['', [Validators.required]],
    last: ['', [Validators.required]], 
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  
  isSuccessful = signal<boolean>(false);
  isSignUpFailed = signal<boolean>(false);
  isLoginFailed = signal<boolean>(true);
  isLoggedIn = signal<boolean>(false);
  isRegistering = signal<boolean>(false);
  errorMessage = signal<string>('');
  roles: string[] = [];

  onSubmit(): void {
    console.log('Registering user...');
    console.log('Form values:', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);

    if (this.registerForm.valid) {
      this.isRegistering.set(true);
      this.disableFormControls();

      const user: TUser = {
        first: this.registerForm.get('first')!.value as string,
        last: this.registerForm.get('last')!.value as string,
        email: this.registerForm.get('email')!.value as string,
        password: this.registerForm.get('password')!.value as string,
        roles: ['user']
      };

      console.log('Registering user:', user);

      this.authService.register(user).subscribe({
        next: (res: TRegisterResponse) => {
          this.isSuccessful.set(true);
          this.isSignUpFailed.set(false);

          this.authService.login(user.email!, user.password!).subscribe({
            next: (loginRes) => {
              this.storageService.saveUser(loginRes);
              this.userService.currentUserId = loginRes.id;

              this.isLoginFailed.set(false);
              this.isLoggedIn.set(this.authService.isLoggedIn());
              this.enableFormControls();
              this.isRegistering.set(false);
              this.roles = this.storageService.getUser().roles;
              this.router.navigate([`${this.userService.currentUserId}/dashboard`]);
              this.modalService.closeModal();
            },
            error: (loginErr) => {
              console.error('Login error after signup', loginErr);
              this.errorMessage.set(loginErr.error.message || 'Error during login after registration');
              this.isSignUpFailed.set(true);
            }
          });
        },
        error: (err) => {
          console.error('Signup error', err);
          this.errorMessage.set(err.error.message || 'Error during registration');
          this.isSignUpFailed.set(true);
          this.enableFormControls();
          this.isRegistering.set(false);
        }
      });
    }

  }

  private disableFormControls(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.disable();
    });
  }

  private enableFormControls(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.enable();
    });
  }
}
