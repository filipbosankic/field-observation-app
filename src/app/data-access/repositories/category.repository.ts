import { db } from '../app-database';
import { Category } from '../../shared/models/category.model';
import { v4 as uuid } from 'uuid';

export class CategoryRepository {

  async create(data: Omit<Category, 'id' | 'updatedAt'>) {
    const now = new Date();

    const entity: Category = {
      ...data,
      id: uuid(),
      updatedAt: now
    };

    await db.categories.add(entity);
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
    return db.categories.toArray();
  }

  async getById(id: string) {
    return db.categories.get(id);
  }
}

export const categoryRepo = new CategoryRepository();
