import { Injectable } from '@angular/core';
import { db } from '../app-database';
import { Category } from '../../shared/models/category.model';
import { v4 as uuid } from 'uuid';
import { DomainEventRepository } from './domain-event.repository';

@Injectable({ providedIn: 'root' })
export class CategoryRepository {

  constructor(private domainEventRepository: DomainEventRepository) { }

  async create(data: Omit<Category, 'id' | 'updatedAt'>) {
    const now = new Date();

    const entity: Category = {
      ...data,
      id: uuid(),
      updatedAt: now
    };

    await db.categories.add(entity);

    await this.domainEventRepository.add({
      id: uuid(),
      aggregateId: entity.id,
      type: 'CAT_CREATED',
      payload: entity,
      occurredAt: now.toISOString(),
      synced: false
    });

    return entity;
  }

  async update(id: string, update: Partial<Category>) {
    const now = new Date();

    await db.categories.update(id, {
      ...update,
      updatedAt: now
    });
  }

  async softDelete(id: string) {
    const now = new Date();

    await db.categories.update(id, {
      deletedAt: now,
      updatedAt: now
    });
  }

  async getAll() {
    return db.categories
      .filter(cat => !cat.deletedAt)
      .toArray();
  }

  async getById(id: string) {
    return db.categories.get(id);
  }

  async ensureSeedCategories() {
    const count = await db.categories.count();

    if (count > 0) {
      return;
    }

    const now = new Date();

    const seedCategories = [
      { id: 'default', name: 'Allgemein' },
      { id: 'person', name: 'Person' },
      { id: 'vehicle', name: 'Fahrzeug' },
      { id: 'public_transport', name: 'Öffentlicher Verkehr' },
      { id: 'public_space', name: 'Öffentlicher Raum' },
      { id: 'traffic_infrastructure', name: 'Verkehrsinfrastruktur' },
      { id: 'station', name: 'Bahnhof / Haltestelle' },
      { id: 'building', name: 'Gebäude' },
      { id: 'incident', name: 'Sachverhalt' },
      { id: 'environment', name: 'Umwelt / Wetter' },
      { id: 'other', name: 'Sonstiges' }
    ];


    await db.categories.bulkAdd(
      seedCategories.map(cat => ({
        ...cat,
        updatedAt: now,
        deletedAt: null
      }))
    );
  }
}
