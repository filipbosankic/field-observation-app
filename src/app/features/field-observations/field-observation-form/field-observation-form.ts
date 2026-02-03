import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FieldObservationRepository } from '../../../data-access/repositories/field-observation.repository';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../shared/models/category.model';
import { CategoryRepository } from '../../../data-access/repositories/category.repository';

@Component({
  selector: 'app-field-observation-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="container">
      <button class="back-link" (click)="goBack()">
        ← Zur Übersicht
      </button>
      <h2 class="card-title">{{ isEdit ? 'Beobachtung bearbeiten' : 'Neue Beobachtung' }}</h2>
      <div class="card">
        <form (ngSubmit)="save()">
          <label>Titel</label>
          <input [(ngModel)]="title" name="title" required>

          <label>Beschreibung</label>
          <textarea [(ngModel)]="description" name="description"></textarea>

          <label>Kategorie</label>

          <select
            *ngIf="categories.length > 0"
            [(ngModel)]="selectedCategoryId"
            name="categoryId"
          >
            <option *ngFor="let cat of categories" [value]="cat.id">
              {{ cat.name }}
            </option>
          </select>

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
  private categoryRepo = inject(CategoryRepository);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id: string | null = null;
  isEdit = false;

  title = '';
  description = '';
  timestamp = new Date().toISOString().slice(0, 16);

  categories: Category[] = [];
  selectedCategoryId = 'default';

  async ngOnInit() {
    await this.categoryRepo.ensureSeedCategories();
    this.categories = await this.categoryRepo.getAll();
    
    this.cdr.detectChanges();

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
      this.selectedCategoryId = obs.categoryId ?? 'default';

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
        timestamp: new Date(this.timestamp),
        categoryId: this.selectedCategoryId
      });
    } else {
      await this.repo.create({
        title: this.title,
        description: this.description,
        timestamp: new Date(this.timestamp),
        categoryId: this.selectedCategoryId
      });
    }

    this.router.navigate(['/observations']);
  }

  goBack() {
    this.router.navigate(['/observations']);
  }
}