import { BaseRepository } from '../../base/BaseRepository.js';
import Category from './Category.model.js';

export class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }
}
