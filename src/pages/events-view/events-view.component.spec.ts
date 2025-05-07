import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsViewComponent } from './events-view.component';

describe('GamesViewComponent', () => {
  let component: EventsViewComponent;
  let fixture: ComponentFixture<EventsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
