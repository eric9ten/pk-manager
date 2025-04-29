import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TTeamColor } from '../../types/team.type';
import { teamColors } from './colors.model';

@Component({
  selector: 'pkm-color-picker',
  imports: [ CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})

export class ColorPickerComponent {

  readonly colors: TTeamColor[] = teamColors;

  onSwatchClick(hexColor: string): void {
    console.log('Swatch clicked: ', hexColor);
  }
}
