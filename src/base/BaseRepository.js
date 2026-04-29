import { connectToDatabase } from '../config/db.js';

export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findMany(filters = {}, options = {}) {
    await connectToDatabase();
    const { 
      sort = { createdAt: -1 }, 
      page = 1, 
      limit = 10,
      populate = []
    } = options;

    const skip = (page - 1) * limit;

    // Soft delete check
    const queryFilters = { ...filters, silindi_mi: { $ne: true } };

    const query = this.model.find(queryFilters)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (populate.length > 0) {
      populate.forEach(p => query.populate(p));
    }

    const data = await query.exec();
    const total = await this.model.countDocuments(queryFilters);

    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id, populate = []) {
    await connectToDatabase();
    const query = this.model.findOne({ _id: id, silindi_mi: { $ne: true } });
    
    if (populate.length > 0) {
      populate.forEach(p => query.populate(p));
    }
    
    return await query.exec();
  }

  async findOne(filters = {}, populate = []) {
    await connectToDatabase();
    const query = this.model.findOne({ ...filters, silindi_mi: { $ne: true } });
    
    if (populate.length > 0) {
      populate.forEach(p => query.populate(p));
    }
    
    return await query.exec();
  }

  async create(data) {
    await connectToDatabase();
    const newItem = new this.model(data);
    return await newItem.save();
  }

  async update(id, data) {
    await connectToDatabase();
    return await this.model.findByIdAndUpdate(
      id, 
      { $set: data }, 
      { new: true, runValidators: true }
    );
  }

  async delete(id, softDelete = true) {
    await connectToDatabase();
    if (softDelete) {
      return await this.model.findByIdAndUpdate(id, { silindi_mi: true }, { new: true });
    }
    return await this.model.findByIdAndDelete(id);
  }
}
