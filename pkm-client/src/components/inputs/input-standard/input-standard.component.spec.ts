import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputStandardComponent } from './input-standard.component';

describe('InputStandardComponent', () => {
  let component: InputStandardComponent;
  let fixture: ComponentFixture<InputStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputStandardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
