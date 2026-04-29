import mongoose from 'mongoose';
import { BaseManager } from '../../base/BaseManager.js';
import Category from '../categories/Category.model.js';
import { connectToDatabase } from '../../config/db.js';

export class EventManager extends BaseManager {
  constructor(repository) {
    super(repository);
  }

  async createEvent(data, userId) {
    await connectToDatabase();
    // Resolve category if it's a string name
    if (typeof data.category === 'string' && !mongoose.isValidObjectId(data.category)) {
        let category = await Category.findOne({ name: { $regex: new RegExp(`^${data.category}$`, 'i') } });
        if (!category) {
            category = await Category.create({ 
                name: data.category, 
                slug: data.category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || 'category'
            });
        }
        data.category = category._id;
    }

    return await this.repository.create({
      ...data,
      organizer: userId
    });
  }

  async updateEvent(id, data, userId, userRole) {
    const event = await this.getById(id);
    
    // Authorization: Only organizer or admin can update
    if (event.organizer.toString() !== userId && userRole !== 'admin') {
      throw new Error('Bu etkinliği güncelleme yetkiniz yok.');
    }

    return await this.repository.update(id, data);
  }
}