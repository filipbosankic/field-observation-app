import { Injectable } from '@angular/core';
import { db } from '../app-database';
import { DomainEvent } from '../../shared/models/domain-event.model';

@Injectable({ providedIn: 'root' })
export class DomainEventRepository {

  async add(event: DomainEvent) {
    return db.table<DomainEvent>('domainEvents').add(event);
  }

  async getUnsynced() {
    return db.table<DomainEvent>('domainEvents')
      .filter(e => e.synced !== true)
      .toArray();
  }

  async markSynced(ids: string[]) {
    return db.table<DomainEvent>('domainEvents')
      .where('id')
      .anyOf(ids)
      .modify({ synced: true });
  }

  async storeRemoteEvents(events: DomainEvent[]) {
    const table = db.table<DomainEvent>('domainEvents');

    for (const event of events) {
      const exists = await table.get(event.id);

      if (!exists) {
        await table.add({
          ...event,
          synced: true
        });
      }
    }
  }

  async getLastSyncTimestamp(): Promise<string | null> {
    const events = await db
      .table<DomainEvent>('domainEvents')
      .toArray();

    if (events.length === 0) {
      return null;
    }

    return events
      .map(e => e.occurredAt)
      .sort()
      .at(-1) ?? null;
  }

  async getAll(): Promise<DomainEvent[]> {
    return db.table<DomainEvent>('domainEvents').toArray();
  }
}