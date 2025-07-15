import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';

@Component({
  selector: 'pkm-button-standard',
  imports: [ CommonModule],
  templateUrl: './button-standard.component.html',
  styleUrl: './button-standard.component.scss'
})
export class ButtonStandardComponent {
  color = model<string>();
  isDisabled = model<boolean>(true);
  label = model.required<string>();
  type = model<string>();

}
