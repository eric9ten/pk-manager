import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ButtonStandardComponent } from "../buttons/button-standard/button-standard.component";

@Component({
  selector: 'pkm-add-team-form',
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule, MatFormFieldModule, ButtonStandardComponent],
  templateUrl: './add-team-form.component.html',
  styleUrl: './add-team-form.component.scss'
})
export class AddTeamFormComponent {
    private fb = inject(FormBuilder);

    protected isChecked = false;
  
    addTeamForm = this.fb.group ({
      name: ['', [Validators.required, Validators.minLength(4)]],
      abbrev: ['', [Validators.required, Validators.maxLength(4)]],
      ageGroup: ['', [Validators.required] ],
      colors: this.fb.group ({
        home: ['#000000'],
        away: ['#ffffff']
      }),
      genGroup: [''],
      owner: ['']
  
    })

  get f(): { [key: string]: AbstractControl } {
    return this.addTeamForm.controls;
  }

  onGenderCheck($event: any) {
    const target = $event.checked
    this.isChecked = target
    const value = target ? 'g' : 'b'

    this.addTeamForm.patchValue({genGroup: value})

  }

  onSubmitClick(): void {
    console.log('Submitting form...')
  }

}
