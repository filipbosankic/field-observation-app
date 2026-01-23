import { Routes } from '@angular/router';
import { FieldObservationsComponent } from './features/field-observations/field-observations.component';
import { FieldObservationsListComponent } from './features/field-observations/field-observations-list/field-observations-list';
import { FieldObservationFormComponent } from './features/field-observations/field-observation-form/field-observation-form';

export const routes: Routes = [
  {
    path: 'observations',
    component: FieldObservationsComponent,
    children: [
      { path: '', component: FieldObservationsListComponent },
      { path: 'new', component: FieldObservationFormComponent }
    ]
  },
  { path: '', redirectTo: 'observations', pathMatch: 'full' }
];
