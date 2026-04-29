import { BaseRepository } from '../../base/BaseRepository.js';
import Community from './Community.model.js';

export class CommunityRepository extends BaseRepository {
  constructor() {
    super(Community);
  }
}
