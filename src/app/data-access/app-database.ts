import Dexie, { Table } from 'dexie';
import { FieldObservation } from '../shared/models/field-observation.model';
import { Category } from '../shared/models/category.model';

export class AppDatabase extends Dexie {

  fieldObservations!: Table<FieldObservation, string>;
  categories!: Table<Category, string>;

  constructor() {
    super('FieldObservationDB');

    this.version(1).stores({
      fieldObservations: 'id, updatedAt, deletedAt, syncStatus',
      categories: 'id, updatedAt, deletedAt'
    });
  }
}

export const db = new AppDatabase();
