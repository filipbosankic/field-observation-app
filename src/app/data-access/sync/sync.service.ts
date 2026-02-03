import { Injectable } from '@angular/core';
import { DomainEventRepository } from '../repositories/domain-event.repository';
import { environment } from '../../../environments/environment';
import { ObservationProjectionService } from '../projections/observation-projection.service';
import { CategoryProjectionService } from '../projections/category-projection.service';

@Injectable({ providedIn: 'root' })
export class SyncService {

  private readonly API_URL = environment.apiUrl;

  constructor(
    private domainEventRepo: DomainEventRepository,
    private observationProjection: ObservationProjectionService,
    private categoryProjection: CategoryProjectionService
  ) { }

  async sync() {
    console.log('Starting sync process…');

    await this.pushLocalChanges();
    await this.pullServerChanges();

    console.log('Sync completed.');
  }

  private async pushLocalChanges() {
    const events = await this.domainEventRepo.getUnsynced();

    if (events.length === 0) {
      console.log('No local events to sync.');
      return;
    }

    console.log('Syncing events:', events);

    const response = await fetch(`${this.API_URL}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(events.map(e => ({
        id: e.id,
        type: e.type,
        aggregateId: e.aggregateId,
        payload: e.payload,
        occurredAt: e.occurredAt
      })))
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    const syncedEventIds = events.map(e => e.id);
    await this.domainEventRepo.markSynced(syncedEventIds);
  }

  private async pullServerChanges() {
    //const lastSync = await this.domainEventRepo.getLastSyncTimestamp();

    //const url = lastSync
    //  ? `${this.API_URL}/events?since=${encodeURIComponent(lastSync)}`
    //  : `${this.API_URL}/events`;

    const url = `${this.API_URL}/events`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Pull sync failed');
    }

    const data = await response.json();
    const remoteEvents = data.events;

    if (remoteEvents.length === 0) {
      console.log('No remote events to apply.');
      return;
    }

    console.log('Applying remote events:', remoteEvents);

    await this.domainEventRepo.storeRemoteEvents(remoteEvents);

    const allEvents = await this.domainEventRepo.getAll();

    allEvents.sort(
      (a, b) =>
        new Date(a.occurredAt).getTime() -
        new Date(b.occurredAt).getTime()
    );

    for (const event of allEvents) {
      await this.categoryProjection.apply(event);
    }

    await this.observationProjection.rebuildFromEvents(allEvents);
  }
}