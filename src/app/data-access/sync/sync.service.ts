import { Injectable } from '@angular/core';
import { DomainEventRepository } from '../repositories/domain-event.repository';

@Injectable({ providedIn: 'root' })
export class SyncService {

  constructor(
    private domainEventRepo: DomainEventRepository
  ) {}

  async sync() {
    console.log('Starting sync process…');
    await this.pushLocalChanges();
    // await this.pullServerChanges(); // noch deaktiviert
    console.log('Sync completed.');
  }

  private async pushLocalChanges() {
    const events = await this.domainEventRepo.getUnsynced();

    if (events.length === 0) {
      console.log('No local events to sync.');
      return;
    }

    console.log('Syncing events:', events);

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