import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalShown = signal(false);
  loginModalShown = signal(false);

  public openModal(): void {
    this.modalShown.set(true);
  }

  openLoginModal(): void {
    this.loginModalShown.set(true);
  }

  public closeModal(): void {
    this.modalShown.set(false);
    this.loginModalShown.set(false);
  }
}
