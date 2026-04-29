export class BaseManager {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll(filters, options) {
    // Business logic before DB call can go here
    return await this.repository.findMany(filters, options);
  }

  async getById(id, populate) {
    const item = await this.repository.findById(id, populate);
    if (!item) {
      throw new Error('Kayıt bulunamadı.');
    }
    return item;
  }

  async create(data) {
    // Validation or transformation logic
    return await this.repository.create(data);
  }

  async update(id, data) {
    // Ensure item exists before update
    const item = await this.getById(id);
    return await this.repository.update(id, data);
  }

  async delete(id) {
    const item = await this.getById(id);
    return await this.repository.delete(id);
  }
}