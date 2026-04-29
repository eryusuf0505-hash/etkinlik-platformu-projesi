import { BaseManager } from '../../base/BaseManager.js';

export class MessageManager extends BaseManager {
  constructor(repository) {
    super(repository);
  }

  async getMessagesByCommunity(communityId) {
    return await this.repository.findByCommunityId(communityId);
  }

  async createMessage(data, userId) {
    return await this.repository.create({ ...data, user: userId });
  }
}
