import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TTeamColor } from '../../types/team.type';

@Component({
  selector: 'pkm-color-picker',
  imports: [ CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})

export class ColorPickerComponent {

  colors: TTeamColor[] = [
    { name: 'black', value: '#000000' },
    { name: 'white', value: '#ffffff' },
  ]

  onSwatchClick(): void {
    console.log('Swatch clicked!')
  }
}
