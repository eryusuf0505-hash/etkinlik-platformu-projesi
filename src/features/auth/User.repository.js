import { BaseRepository } from '../../base/BaseRepository.js';
import User from './User.model.js';
import { connectToDatabase } from '../../config/db.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    await connectToDatabase();
    return await this.model.findOne({ email, silindi_mi: { $ne: true } }).select('+password');
  }
}
