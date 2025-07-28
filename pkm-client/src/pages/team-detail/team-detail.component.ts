import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '@services/token-storage.service';
import { Observable, tap, catchError, Subject, takeUntil } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { StorageService } from '@services/storage.service';
import { TeamService } from '@services/team.service';
import { TTeam, TTeamColor } from '@customTypes/team.type';
import { GamesCardComponent } from '@components/games/games-card/games-card.component';
import { PlayersCardComponent } from '@components/players/players-card/players-card.component';
import { AddGameFormComponent } from '@components/add-game-form/add-game-form.component';
import { TUser } from '@customTypes/user.type';
import { ColorPickerComponent } from '@components/color-picker/color-picker.component';
import { ButtonTextIconComponent } from '@components/buttons/button-text-icon/button-text-icon.component';

@Component({
  selector: 'pkm-team-detail',
  standalone: true,
  imports: [
    CommonModule,
    GamesCardComponent,
    PlayersCardComponent,
    MatSidenavModule,
    AddGameFormComponent,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    ButtonTextIconComponent,
  ],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly storageService = inject(StorageService);
  private readonly teamService = inject(TeamService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private fb = inject(FormBuilder);
  readonly dialog = inject(MatDialog);

  readonly currentUser = signal<TUser | null>(this.storageService.getUser());
  readonly isEditing = signal<boolean>(false);
  readonly loadingTeam = signal<boolean>(true);
  error: string | null = null;
  team!: Observable<TTeam>;
  teamId: string | null = null;
  teamColor = signal<TTeamColor>({ name: 'black', value: '#000000' });
  private destroy$ = new Subject<void>();

  teamForm = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(4)]],
    abbrev: ['', [Validators.required, Validators.maxLength(4)]],
    ageGroup: ['', [Validators.required]],
    colors: this.fb.group({
      home: ['#000000'],
      away: ['#ffffff'],
    }),
    genGroup: ['unkn.'],
  });

  ngOnInit(): void {
    if (!this.tokenStorageService.getToken()) {
      this.error = 'User not logged in';
      this.router.navigate(['/home']);
      return;
    }
    this.teamId = this.route.snapshot.paramMap.get('id');
    if (this.teamId) {
      this.team = this.getTeam(this.teamId);
      this.team.pipe(takeUntil(this.destroy$)).subscribe((t) => {
        this.teamForm.patchValue({
          id: t._id,
          name: t.name,
          abbrev: t.abbrev,
          ageGroup: t.ageGroup,
          genGroup: t.genGroup,
          colors: {
            home: t.colors?.home ?? '#000000',
            away: t.colors?.away ?? '#ffffff',
          },
        });
        this.disableInputs();
      });
    } else {
      this.error = 'Invalid team ID';
      this.loadingTeam.set(false);
      console.error('TeamDetailComponent: No team ID provided');
      this.router.navigate([this.tokenStorageService.getUser().id, 'teams']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onColorClick(e: any): void {
    const dialogRef = this.dialog.open(ColorPickerComponent, {
      data: { color: this.teamColor() },
    });

    dialogRef.afterClosed().subscribe((color) => {
      if (color !== undefined) {
        this.teamColor.set(color);
        const targetId = e.target.id;
        if (targetId === 'homeColor') {
          this.teamForm.patchValue({ colors: { home: color } });
        } else if (targetId === 'awayColor') {
          this.teamForm.patchValue({ colors: { away: color } });
        }
      }
    });
  }

  onCancelClick(): void {
    console.log('Cancel Editing...');
    this.disableInputs();
    this.isEditing.set(false);
    // Reset form to original team data
    this.team.pipe(takeUntil(this.destroy$)).subscribe((t) => {
      this.teamForm.patchValue({
        id: t._id,
        name: t.name,
        abbrev: t.abbrev,
        ageGroup: t.ageGroup,
        genGroup: t.genGroup,
        colors: {
          home: t.colors?.home ?? '#000000',
          away: t.colors?.away ?? '#ffffff',
        },
      });
    });
  }

  onEditClick(): void {
    this.enableInputs();
    this.isEditing.set(true);
  }

  onSaveClick(): void {
    console.log('Saving...');
    if (this.teamForm.invalid) {
      console.warn('TeamDetailComponent: Form is invalid');
      return;
    }
    const formValue = this.teamForm.value;
    this.teamService.updateTeam({
      _id: formValue.id!,
      name: formValue.name!,
      abbrev: formValue.abbrev!,
      ageGroup: formValue.ageGroup!,
      genGroup: formValue.genGroup!,
      colors: {
        home: formValue.colors!.home!,
        away: formValue.colors!.away!,
      },
    }).subscribe({
      next: (updatedTeam) => {
        console.log('TeamDetailComponent: Team updated', updatedTeam);
        this.team = this.getTeam(this.teamId!);
        this.disableInputs();
        this.isEditing.set(false);
      },
      error: (err) => {
        console.error('TeamDetailComponent: Error updating team', err);
        this.error = err.error?.message || 'Failed to update team';
      },
    });
  }

  private disableInputs(): void {
    this.teamForm.controls.name.disable();
    this.teamForm.controls.abbrev.disable();
    this.teamForm.controls.ageGroup.disable();
    this.teamForm.controls.genGroup.disable();
  }

  private enableInputs(): void {
    this.teamForm.controls.name.enable();
    this.teamForm.controls.abbrev.enable();
    this.teamForm.controls.ageGroup.enable();
    this.teamForm.controls.genGroup.enable();
  }

  private getTeam(id: string): Observable<TTeam> {
    return this.teamService.getTeam(id).pipe(
      tap((data) => {
        this.loadingTeam.set(false);
      }),
      catchError((e) => {
        this.error = e.error?.message || 'Failed to load team';
        this.loadingTeam.set(false);
        console.error('TeamDetailComponent: Error loading team', e);
        throw e;
      })
    );
  }
}