import { CommonModule } from '@angular/common';
import { Component, inject, Input, model, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { TTeamColor } from '../../types/team.type';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'pkm-add-team-form',
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatFormFieldModule, ButtonStandardComponent],
  templateUrl: './add-team-form.component.html',
  styleUrl: './add-team-form.component.scss'
})
export class AddTeamFormComponent {
  @Input() sidenav!: MatSidenav;
  teamColor = signal<TTeamColor>({name: 'black', value: '#000000'});
  private fb = inject(FormBuilder);

  readonly dialog = inject(MatDialog);
  protected isChecked = false;

  addTeamForm = this.fb.group ({
    name: ['', [Validators.required, Validators.minLength(4)]],
    abbrev: ['', [Validators.required, Validators.maxLength(4)]],
    ageGroup: ['', [Validators.required] ],
    colors: this.fb.group ({
      home: ['#000000'],
      away: ['#ffffff']
    }),
    genGroup: ['girls'],
    owner: ['']

  })

  constructor() {}

  get f(): { [key: string]: AbstractControl } {
    return this.addTeamForm.controls;
  }

  get homeColorValue(): string {
    return this.addTeamForm.get('colors.home')?.value || '';
  }
  
  get awayColorValue(): string {
    return this.addTeamForm.get('colors.away')?.value || '';
  }

  onGenderCheck($event: any) {
    const target = $event.checked
    this.isChecked = target
    const value = target ? 'g' : 'b'

    this.addTeamForm.patchValue({genGroup: value})

  }

  onSubmitClick(): void {
    console.log('Submitting form...',  this.addTeamForm)
    this.addTeamForm.reset();
    this.sidenav.close();
  }

  onSwatchClick(e: any): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      data: {color: this.teamColor()} 
    });

    dialogRef.afterClosed().subscribe(color => {
      this.teamColor.set(color);

      if (e.target.id === 'homeColorSwatch') {
        this.addTeamForm.patchValue({colors: {home: color}})
      }
      
      if (e.target.id === 'awayColorSwatch') {
        this.addTeamForm.patchValue({colors: {away: color}})
      }
    });
  }
}
