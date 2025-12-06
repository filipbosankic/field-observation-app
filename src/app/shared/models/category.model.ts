export interface Category {
  id: string;
  name: string;
  color?: string;
  updatedAt: Date;
  deletedAt?: Date | null;
}
