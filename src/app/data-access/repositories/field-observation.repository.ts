import { Injectable } from '@angular/core';
import { db } from '../app-database';
import { FieldObservation } from '../../shared/models/field-observation.model';
import { v4 as uuid } from 'uuid';
import { DomainEventRepository } from './domain-event.repository';

@Injectable({ providedIn: 'root' })
export class FieldObservationRepository {

  constructor(private domainEventRepository: DomainEventRepository) { }

  async create(data: Omit<FieldObservation, 'id' | 'updatedAt' | 'syncStatus'>) {
    const now = new Date();

    const entity: FieldObservation = {
      ...data,
      id: uuid(),
      updatedAt: now,
      syncStatus: 'pending'
    };

    await db.fieldObservations.add(entity);
    
    await this.domainEventRepository.add({
      id: uuid(),
      aggregateId: entity.id,
      type: 'OBS_CREATED',
      payload: entity,
      occurredAt: new Date().toISOString(),
      synced: false
    });

    return entity;
  }

  async update(id: string, update: Partial<FieldObservation>) {
    const now = new Date();

    await db.fieldObservations.update(id, {
      ...update,
      updatedAt: now,
      syncStatus: 'pending'
    });

    await this.domainEventRepository.add({
      id: uuid(),
      aggregateId: id,
      type: 'OBS_UPDATED',
      payload: update,
      occurredAt: new Date().toISOString(),
      synced: false
    });

  }

  async softDelete(id: string) {
    const now = new Date();

    await db.fieldObservations.update(id, {
      deletedAt: now,
      updatedAt: now,
      syncStatus: 'pending'
    });

    await this.domainEventRepository.add({
      id: uuid(),
      aggregateId: id,
      type: 'OBS_DELETED',
      payload: { deletedAt: now },
      occurredAt: new Date().toISOString(),
      synced: false
    });
  }

  async getAll() {
    return db.fieldObservations
      .filter(obs => !obs.deletedAt)
      .toArray();
  }

  async getById(id: string) {
    return db.fieldObservations.get(id);
  }
}
