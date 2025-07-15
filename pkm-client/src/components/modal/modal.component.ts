import { Component, input, Input } from '@angular/core';
import { ModalService } from '@services/modal.service';
import { ButtonIconComponent } from "../buttons/button-icon/button-icon.component";

@Component({
  selector: 'pkm-modal',
  imports: [ButtonIconComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  readonly isShown = input<boolean>(false);

  @Input() title = 'modal title';

  constructor(
    private modalService: ModalService
  ) {

  }

  onCloseClick(): void {
    this.modalService.closeModal();
  }

}
