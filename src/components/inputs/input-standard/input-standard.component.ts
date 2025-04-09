import { Component, model } from '@angular/core';

@Component({
  selector: 'pkm-input-standard',
  imports: [],
  templateUrl: './input-standard.component.html',
  styleUrl: './input-standard.component.scss'
})

export class InputStandardComponent {
  isDisabled = model<boolean>(true);
  placeholder = model<string>();
  type = model<string>('input');

}
