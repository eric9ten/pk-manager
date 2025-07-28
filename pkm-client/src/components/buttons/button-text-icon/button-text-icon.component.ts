import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pkm-button-text-icon',
  imports: [ CommonModule ],
  templateUrl: './button-text-icon.component.html',
  styleUrl: './button-text-icon.component.scss'
})
export class ButtonTextIconComponent {
  @Input() label = 'label';
}
