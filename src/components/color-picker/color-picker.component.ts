import { Component } from '@angular/core';

@Component({
  selector: 'pkm-color-picker',
  imports: [],
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss'
})

type TeamColor = {
  name: string;
  value: string;
}

export class ColorPickerComponent {

  colors: TeamColor[] = [
    { name: 'black', value: '#000000' },
    { name: 'white', value: '#ffffff' },
  ]
}
