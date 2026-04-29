import { BaseManager } from '../../base/BaseManager.js';

export class CategoryManager extends BaseManager {
  constructor(repository) {
    super(repository);
  }

  async createCategory(data, userRole) {
    if (userRole !== 'admin') {
      throw new Error('Sadece yöneticiler kategori ekleyebilir.');
    }
    
    // Auto-generate slug if not provided
    if (!data.slug) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    
    return await this.repository.create(data);
  }
}
