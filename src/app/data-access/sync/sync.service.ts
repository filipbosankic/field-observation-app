import { fieldObservationRepo } from '../repositories/field-observation.repository';
import { categoryRepo } from '../repositories/category.repository';

export class SyncService {

  async sync() {
    console.log('Starting sync process…');

    await this.pushLocalChanges();
    await this.pullServerChanges();

    console.log('Sync completed.');
  }

  private async pushLocalChanges() {
    console.log('Pushing local changes…');

    // TODO: read all "pending" observations + categories
    // TODO: send them to backend API
    // TODO: update local sync status

    // placeholder
    return;
  }

  private async pullServerChanges() {
    console.log('Pulling server changes…');

    // TODO: fetch remote changes
    // TODO: merge into IndexedDB
    // TODO: handle conflicts

    // placeholder
    return;
  }
}

export const syncService = new SyncService();
