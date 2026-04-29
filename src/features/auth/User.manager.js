import { BaseManager } from '../../base/BaseManager.js';

export class UserManager extends BaseManager {
  constructor(repository) {
    super(repository);
  }

  async validateUniqueEmail(email) {
    const existingUser = await this.repository.findOne({ email });
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanımda.');
    }
  }

  async getProfile(id) {
    return await this.getById(id);
  }

  async findByEmail(email) {
    return await this.repository.findByEmail(email);
  }
}
