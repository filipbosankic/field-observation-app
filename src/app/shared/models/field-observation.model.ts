export interface FieldObservation {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  categoryId: string;
  updatedAt: Date;
  deletedAt?: Date | null;
  syncStatus: 'pending' | 'synced' | 'conflict';
}
