import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FieldObservationRepository } from '../../../data-access/repositories/field-observation.repository';
import { FieldObservation } from '../../../shared/models/field-observation.model';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';
import { SyncService } from '../../../data-access/sync/sync.service';
import { CategoryRepository } from '../../../data-access/repositories/category.repository';

@Component({
  selector: 'app-field-observations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="header">
        <button (click)="sync()" [disabled]="syncing">
          {{ syncing ? 'Synchronisiere…' : 'Jetzt synchronisieren' }}
        </button>
        <h1>Beobachtungen</h1>
        <button class="primary" (click)="createNew()">Neue Beobachtung</button>
      </div>

      <div class="content">
        <ng-container *ngIf="observations.length > 0">
          <div class="card list-card">
            <ul class="list">
              <li *ngFor="let obs of observations; trackBy: trackById" class="item">
                <div>
                  <strong>{{ obs.title }}</strong>
                  <span style="margin-left: 0.5rem; color: #666; font-size: 0.85rem;">
                    • {{ categoriesMap.get(obs.categoryId) ?? 'Unbekannt' }}
                  </span>
                  <br>
                  <small>
                    {{ obs.timestamp | date:'short' }} · {{ obs.description }}
                  </small>
                </div>
                <div class="actions">
                  <button (click)="edit(obs.id)">Bearbeiten</button>
                  <button (click)="delete(obs.id)">Löschen</button>
                </div>
              </li>
            </ul>
          </div>
        </ng-container>
        <div *ngIf="observations.length === 0" class="empty-wrapper">
          <div class="empty-state">
            <div class="empty-title">
              Noch keine Beobachtungen vorhanden.
            </div>
            <div class="empty-text">
              Erstelle eine neue Beobachtung, um zu beginnen.
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FieldObservationsListComponent implements OnInit {

  constructor() {
    console.log('FIELD OBS LIST COMPONENT LOADED');
    console.log('LOADED:', 'LIST.TS');
  }

  private repo = inject(FieldObservationRepository);
  private categoryRepo = inject(CategoryRepository);
  private router = inject(Router);
  private syncService = inject(SyncService);
  private cdr = inject(ChangeDetectorRef);

  observations: FieldObservation[] = [];
  categoriesMap = new Map<string, string>();
  syncing = false;

  async ngOnInit() {
    await this.load();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.load();
      });
  }

  async load() {
    const [observations, categories] = await Promise.all([
      this.repo.getAll(),
      this.categoryRepo.getAll()
    ]);

    this.categoriesMap = new Map(
      categories.map(cat => [cat.id, cat.name])
    );

    console.log('GET ALL OBSERVATIONS:', observations);
    console.log('GET ALL CATEGORIES:', categories);

    this.observations = [...observations];
    this.cdr.detectChanges();
  }


  createNew() {
    console.log("BUTTON CLICKED!");
    this.router.navigate(['/observations/new']);
  }

  edit(id: string) {
    this.router.navigate(['/observations', id, 'edit']);
  }

  async delete(id: string) {
    await this.repo.softDelete(id);
    await this.load();
  }

  async sync() {
    console.log('SYNC BUTTON CLICKED');
    this.syncing = true;

    this.cdr.detectChanges();

    try {
      await this.syncService.sync();

      await this.load();

      alert('Sync abgeschlossen');
    } catch {
      alert('Sync fehlgeschlagen');
    } finally {
      this.syncing = false;
      this.cdr.detectChanges();
    }
  }

  trackById(_: number, obs: FieldObservation) {
    return obs.id;
  }

}
