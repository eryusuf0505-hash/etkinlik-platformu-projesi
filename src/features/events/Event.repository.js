import { BaseRepository } from '../../base/BaseRepository.js';
import Event from './Event.model.js';

export class EventRepository extends BaseRepository {
  constructor() {
    super(Event);
  }

  async findWithFilters(filters, options) {
    const mongoFilters = { ...filters };
    
    // Date filtering (e.g., upcoming events)
    if (filters.startDate) {
      mongoFilters.date = { $gte: new Date(filters.startDate) };
      delete mongoFilters.startDate;
    }
    
    if (filters.endDate) {
      mongoFilters.date = { ...mongoFilters.date, $lte: new Date(filters.endDate) };
      delete mongoFilters.endDate;
    }

    // String matching for city
    if (filters.city) {
      mongoFilters.city = { $regex: filters.city, $options: 'i' };
    }

    return await this.findMany(mongoFilters, {
      ...options,
      populate: ['category', 'organizer', 'community']
    });
  }
}
