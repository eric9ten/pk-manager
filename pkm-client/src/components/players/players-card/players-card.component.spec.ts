import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersCardComponent } from './players-card.component';

describe('PlayersCardComponent', () => {
  let component: PlayersCardComponent;
  let fixture: ComponentFixture<PlayersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
