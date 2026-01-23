import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FieldObservationRepository } from '../../../data-access/repositories/field-observation.repository';
import { FieldObservation } from '../../../shared/models/field-observation.model';
import { NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-field-observations-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">


      <h1>Beobachtungen</h1>

      <button class="create-btn" (click)="createNew()">Neue Beobachtung</button>

      <ul>
        <li *ngFor="let obs of observations; trackBy: trackById" class="item">
          <div>
            <strong>{{ obs.title }}</strong> <br>
            <small>
              {{ obs.timestamp | date:'short' }}
              · {{ obs.description }}
            </small>

          </div> 

          <div class="actions">
            <button (click)="edit(obs.id)">Bearbeiten</button>
            <button (click)="delete(obs.id)">Löschen</button>
          </div>
        </li>
      </ul>

      <p *ngIf="observations.length === 0">
        Noch keine Beobachtungen erfasst.
      </p>
    </div>
  `
})
export class FieldObservationsListComponent implements OnInit {
  
  private cdr = inject(ChangeDetectorRef);
  constructor() {
    console.log('FIELD OBS LIST COMPONENT LOADED');
    console.log('LOADED:', 'LIST.TS');
  }

  private repo = inject(FieldObservationRepository);
  private router = inject(Router);

  observations: FieldObservation[] = [];

  async ngOnInit() {
    await this.load();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.load();
      });
  }

  async load() {
    const data = await this.repo.getAll();
    console.log('GET ALL RESULT:', data);
  this.observations = [...data];
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

  trackById(_: number, obs: FieldObservation) {
  return obs.id;
}

}
