import { BaseRepository } from '../../base/BaseRepository.js';
import Message from './Message.model.js';
import { connectToDatabase } from '../../config/db.js';

export class MessageRepository extends BaseRepository {
  constructor() {
    super(Message);
  }

  async findByCommunityId(communityId, options = {}) {
    await connectToDatabase();
    const { sort = { olusturulma_tarihi: 1 }, limit = 100 } = options;
    
    // Hem ID hem de isim ile sorgulama desteği (fallback için)
    let query = { community: communityId, silindi_mi: { $ne: true } };
    
    return await this.model.find(query)
      .populate('user', 'name profileImage role')
      .sort(sort)
      .limit(limit)
      .exec();
  }
}
