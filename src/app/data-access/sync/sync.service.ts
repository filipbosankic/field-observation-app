import { Injectable } from '@angular/core';
import { DomainEventRepository } from '../repositories/domain-event.repository';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SyncService {

  private readonly API_URL = 'http://localhost:3000';

  constructor(
    private domainEventRepo: DomainEventRepository,
    private http: HttpClient
  ) {}

  async sync() {
    console.log('Starting sync process…');

    await this.pushLocalChanges();
    // await this.pullServerChanges(); // später
    
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
        type: e.type.replace('OBS_', ''), // OBS_CREATED → CREATED
        entityId: e.aggregateId,
        payload: e.payload,
        timestamp: e.occurredAt
      })))
    });

    if (!response.ok) {
      throw new Error('Sync failed');
    }

    const syncedEventIds = events.map(e => e.id);
    await this.domainEventRepo.markSynced(syncedEventIds);
  }

  /**
   * Pull-Mechanismus wird noch in einem späteren Schritt implementiert,
   * sobald ein serverseitiger Event-Store verfügbar ist.
   */
  private async pullServerChanges() {
    // TODO: fetch server-side events and apply locally
  }
}