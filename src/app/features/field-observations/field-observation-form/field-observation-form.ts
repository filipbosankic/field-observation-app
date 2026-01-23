import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldObservationRepository } from '../../../data-access/repositories/field-observation.repository';
import { Router } from '@angular/router';

@Component({
  selector: 'app-field-observation-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <h2>Neue Beobachtung</h2>

    <form (ngSubmit)="save()">
      <label>Titel</label>
      <input [(ngModel)]="title" name="title" required>

      <label>Beschreibung</label>
      <textarea [(ngModel)]="description" name="description"></textarea>

      <label>Zeitpunkt</label>
      <input type="datetime-local" [(ngModel)]="timestamp" name="timestamp" required>

      <button type="submit">Speichern</button>
    </form>
  `
})
export class FieldObservationFormComponent {

  private repo = inject(FieldObservationRepository);
  private router = inject(Router);
  
  title = '';
  description = '';
  timestamp = new Date().toISOString().slice(0, 16);

  async save() {
    await this.repo.create({
      title: this.title,
      description: this.description,
      timestamp: new Date(this.timestamp),
      categoryId: 'default'
    });

    this.router.navigate(['/observations']);
  }
}
