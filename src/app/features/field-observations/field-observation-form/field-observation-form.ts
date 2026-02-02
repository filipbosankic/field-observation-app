import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldObservationRepository } from '../../../data-access/repositories/field-observation.repository';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-field-observation-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <h2>{{ isEdit ? 'Beobachtung bearbeiten' : 'Neue Beobachtung' }}</h2>
      <div class="card">
        <form (ngSubmit)="save()">
          <label>Titel</label>
          <input [(ngModel)]="title" name="title" required>

          <label>Beschreibung</label>
          <textarea [(ngModel)]="description" name="description"></textarea>

          <label>Zeitpunkt</label>
          <input type="datetime-local" [(ngModel)]="timestamp" name="timestamp" required>

          <button type="submit" class="primary">{{ isEdit ? 'Speichern' : 'Erstellen' }}</button>
        </form>
      </div>
    </div>
  `
})
export class FieldObservationFormComponent implements OnInit {

  private repo = inject(FieldObservationRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id: string | null = null;
  isEdit = false;

  title = '';
  description = '';
  timestamp = new Date().toISOString().slice(0, 16);

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.id;

    if (this.isEdit && this.id) {
      const obs = await this.repo.getById(this.id);

      if (!obs) {
        alert('Beobachtung nicht gefunden');
        this.router.navigate(['/observations']);
        return;
      }

      this.title = obs.title;
      this.description = obs.description;

      const d = new Date(obs.timestamp);
      this.timestamp = new Date(
        d.getTime() - d.getTimezoneOffset() * 60000
      ).toISOString().slice(0, 16);

      this.cdr.detectChanges();

    }
  }

  async save() {
    if (this.id) {
      await this.repo.update(this.id, {
        title: this.title,
        description: this.description,
        timestamp: new Date(this.timestamp)
      });
    } else {
      await this.repo.create({
        title: this.title,
        description: this.description,
        timestamp: new Date(this.timestamp),
        categoryId: 'default'
      });
    }

    this.router.navigate(['/observations']);
  }
}