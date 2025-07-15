import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';

@Component({
  selector: 'pkm-button-icon',
  imports: [ CommonModule],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss'
})
export class ButtonIconComponent {
  color = model<string>();
  isDisabled = model<boolean>(false);

}
