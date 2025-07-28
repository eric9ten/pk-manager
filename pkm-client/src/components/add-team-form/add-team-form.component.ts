import { CommonModule } from '@angular/common';
import { Component, inject, Input, model, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialog } from '@angular/material/dialog';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { TTeam, TTeamColor } from '../../types/team.type';
import { MatSidenav } from '@angular/material/sidenav';
import { TeamService } from '@services/team.service';
import { TokenStorageService } from '@services/token-storage.service';

@Component({
  selector: 'pkm-add-team-form',
  imports: [ CommonModule, ReactiveFormsModule, MatRadioModule, MatFormFieldModule, 
    ButtonStandardComponent ],
  templateUrl: './add-team-form.component.html',
  styleUrl: './add-team-form.component.scss'
})
export class AddTeamFormComponent {
  @Input() sidenav!: MatSidenav;

  private readonly teamService = inject(TeamService);
  private readonly storageService = inject(TokenStorageService);
  private fb = inject(FormBuilder);

  teamColor = signal<TTeamColor>({name: 'black', value: '#000000'});
  private readonly user: any = this.storageService.getUser();

  readonly dialog = inject(MatDialog);
  protected isChecked = false;
  error: string | null = null;

  addTeamForm = this.fb.group ({
    name: ['', [Validators.required, Validators.minLength(4)]],
    abbrev: ['', [Validators.required, Validators.maxLength(4)]],
    ageGroup: ['', [Validators.required] ],
    colors: this.fb.group ({
      home: ['#000000'],
      away: ['#ffffff']
    }),
    genGroup: ['girls'],
    owner: [this.user?.id, [Validators.required]],

  })

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
    console.log('Submitting form...',  this.addTeamForm.value);
    this.addTeam();
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

  private addTeam(): void {
    this.error = null;
    this.teamService.createTeam(this.addTeamForm.value as TTeam).subscribe({
      next: (data) => {
        this.teamService.notifyTeamCreated();
        this.addTeamForm.reset({
          name: '',
          abbrev: '',
          ageGroup: '',
          colors: { home: '#000000', away: '#ffffff' },
          genGroup: 'girls',
          owner: this.user?.id
        });
        this.sidenav.close();
      },
      error: (e) => {
        this.error = e.error?.message || 'Failed to create team';
        console.error('AddTeamFormComponent: Error adding team', e);
      }
    });
  }
}
