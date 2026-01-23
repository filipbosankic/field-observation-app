import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldObservationFormComponent } from './field-observation-form';

describe('FieldObservationForm', () => {
  let component: FieldObservationFormComponent;
  let fixture: ComponentFixture<FieldObservationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldObservationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldObservationFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
