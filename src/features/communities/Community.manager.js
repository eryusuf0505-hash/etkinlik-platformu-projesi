import { BaseManager } from '../../base/BaseManager.js';

export class CommunityManager extends BaseManager {
  constructor(repository) {
    super(repository);
  }

  async createCommunity(data, userId) {
    return await this.repository.create({
      ...data,
      owner: userId,
      members: [userId] // Creator is the first member
    });
  }

  async addMember(communityId, userId) {
    const community = await this.getById(communityId);
    if (community.members.includes(userId)) {
      throw new Error('Zaten bu topluluğun üyesisiniz.');
    }
    
    return await this.repository.update(communityId, {
      $push: { members: userId }
    });
  }
}
