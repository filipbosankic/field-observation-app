import { Injectable } from '@angular/core';
import { db } from '../app-database';
import { DomainEvent } from '../../shared/models/domain-event.model';
import { FieldObservation } from '../../shared/models/field-observation.model';

@Injectable({ providedIn: 'root' })
export class ObservationProjectionService {

    async rebuildFromEvents(events: DomainEvent[]) {

        await db.table('fieldObservations').clear();

        for (const event of events) {
            await this.applyEvent(event);
        }
    }

    private async applyEvent(event: DomainEvent) {
        const table = db.table<FieldObservation>('fieldObservations');

        switch (event.type) {
            case 'OBS_CREATED': {
                if (!event.aggregateId) {
                    console.warn('OBS_CREATED without aggregateId, skipping', event);
                    return;
                }

                if (!event.payload) {
                    console.warn('OBS_CREATED without payload, skipping', event);
                    return;
                }

                const observation: FieldObservation = {
                    id: event.aggregateId,
                    title: event.payload.title ?? '',
                    description: event.payload.description ?? '',
                    timestamp: event.payload.timestamp
                        ? new Date(event.payload.timestamp)
                        : new Date(event.occurredAt),
                    categoryId: event.payload.categoryId ?? 'default',
                    updatedAt: new Date(event.occurredAt),
                    deletedAt: null,
                    syncStatus: 'synced'
                };

                await table.put(observation);
                break;
            }


            case 'OBS_UPDATED': {
                const existing = await table.get(event.aggregateId);

                if (!existing) {
                    console.warn('OBS_UPDATED for missing entity, skipping', event);
                    return;
                }

                // 🔥 DAS IST DER ENTSCHEIDENDE TEIL
                if (existing.deletedAt) {
                    console.warn('OBS_UPDATED after delete, ignored', event);
                    return;
                }

                const updated: FieldObservation = {
                    ...existing,
                    ...event.payload,
                    updatedAt: new Date(event.occurredAt),
                    syncStatus: 'synced'
                };

                await table.put(updated);
                break;
            }


            case 'OBS_DELETED': {
                await table.update(event.aggregateId, {
                    deletedAt: new Date(event.occurredAt),
                    updatedAt: new Date(event.occurredAt),
                    syncStatus: 'synced'
                });
                break;
            }
        }
    }
}
