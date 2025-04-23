import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCircleIconComponent } from './add-circle-icon.component';

describe('AddCircleIconComponent', () => {
  let component: AddCircleIconComponent;
  let fixture: ComponentFixture<AddCircleIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCircleIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCircleIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
