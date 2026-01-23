import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldObservationsListComponent } from './field-observations-list';

describe('FieldObservationsListComponent', () => {
  let component: FieldObservationsListComponent;
  let fixture: ComponentFixture<FieldObservationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldObservationsListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FieldObservationsListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
