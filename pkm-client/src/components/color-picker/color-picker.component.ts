import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { TTeamColor } from '../../types/team.type';
import { teamColors } from './colors.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pkm-color-picker',
  imports: [ CommonModule],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})

export class ColorPickerComponent {
  readonly dialogRef = inject(MatDialogRef<ColorPickerComponent>);
  readonly data = inject<TTeamColor>(MAT_DIALOG_DATA);
  readonly color = model(this.data.value);
  readonly colors: TTeamColor[] = teamColors;

  onSwatchClick(color: string): void {
    this.dialogRef.close(color);
  }
}
