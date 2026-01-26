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
}
