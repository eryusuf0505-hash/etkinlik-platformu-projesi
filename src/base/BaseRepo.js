import { connectToDatabase } from '../config/db.js';

export class BaseRepo {
  constructor(model) {
    this.model = model;
  }

  async get_many() {
    await connectToDatabase();
    return await this.model.find({ silindi_mi: false }).sort({ createdAt: -1 });
  }

  async create(data) {
    await connectToDatabase();
    return await this.model.create(data);
  }
}