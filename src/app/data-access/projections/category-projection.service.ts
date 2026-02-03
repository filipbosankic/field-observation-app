import { Injectable } from '@angular/core';
import { db } from '../app-database';
import { DomainEvent } from '../../shared/models/domain-event.model';
import { Category } from '../../shared/models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryProjectionService {

    async apply(event: DomainEvent) {

        if (event.type !== 'CAT_CREATED') {
            return;
        }

        const existing = await db.categories.get(event.aggregateId);
        if (existing) {
            return;
        }

        if (!event.payload) {
            console.warn('CAT_CREATED without payload, skipping', event);
            return;
        }

        const payload = event.payload as Category;

        await db.categories.add({
            id: event.aggregateId,
            name: payload.name,
            color: payload.color,
            updatedAt: new Date(event.occurredAt),
            deletedAt: null
        });
    }
}
