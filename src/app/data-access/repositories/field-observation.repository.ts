import { db } from '../app-database';
import { FieldObservation } from '../../shared/models/field-observation.model';
import { v4 as uuid } from 'uuid';

export class FieldObservationRepository {

  async create(data: Omit<FieldObservation, 'id' | 'updatedAt' | 'syncStatus'>) {
    const now = new Date();

    const entity: FieldObservation = {
      ...data,
      id: uuid(),
      updatedAt: now,
      syncStatus: 'pending'
    };

    await db.fieldObservations.add(entity);
    return entity;
  }

  async update(id: string, update: Partial<FieldObservation>) {
    const now = new Date();

    await db.fieldObservations.update(id, {
      ...update,
      updatedAt: now,
      syncStatus: 'pending'
    });
  }

  async softDelete(id: string) {
    const now = new Date();

    await db.fieldObservations.update(id, {
      deletedAt: now,
      updatedAt: now,
      syncStatus: 'pending'
    });
  }

  async getAll() {
    return db.fieldObservations.toArray();
  }

  async getById(id: string) {
    return db.fieldObservations.get(id);
  }
}

export const fieldObservationRepo = new FieldObservationRepository();
