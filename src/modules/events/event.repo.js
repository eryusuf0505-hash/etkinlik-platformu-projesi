import { BaseRepo } from '../../base/BaseRepo.js';
import { EventModel } from './event.model.js';

// BaseRepo'daki tüm CRUD işlemlerini miras alıyoruz (Extends)
export class EventRepo extends BaseRepo {
  constructor() {
    super(EventModel);
  }
}