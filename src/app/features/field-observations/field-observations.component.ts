import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-field-observations',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class FieldObservationsComponent {
    constructor() {
    console.log('LOADED:', 'COMPONENT.TS');
    }
}
