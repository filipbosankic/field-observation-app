export type DomainEventType =
  | 'OBS_CREATED'
  | 'OBS_UPDATED'
  | 'OBS_DELETED'
  | 'CAT_CREATED';

export interface DomainEvent {
  id: string;
  aggregateId: string;
  type: DomainEventType;
  payload: any;
  occurredAt: string;
  synced: boolean;
}