import Event from './event.entity';
import dbConnect from '../../server/db/connection';

// REPO (REPOSITORY) KATMANI
// Amacı: Sadece veritabanı işlemlerini (CRUD) yapmak. İş mantığı veya veri doğrulama burada olmaz.
// Veritabanı ile ilgili tüm sorgular bu sınıfın içinde toplanır (DRY prensibi).

class EventRepository {
  // 1. CREATE (Oluşturma)
  async create(eventData) {
    await dbConnect(); // Veritabanına bağlandığımızdan emin oluyoruz
    const newEvent = await Event.create(eventData);
    return newEvent;
  }

  // 2. READ (Okuma, Listeleme, Filtreleme, Sıralama ve Sayfalama)
  async findAll(filters = {}, page = 1, limit = 10) {
    await dbConnect();
    
    // Sayfalama hesabı (Örn: 2. sayfa için ilk 10 veriyi atla)
    const skip = (page - 1) * limit;
    
    // Etkinlikleri filtrele, en yeniye göre sırala (createdAt: -1), sayfalama sınırlarını uygula
    const events = await Event.find(filters)
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(limit);
      
    // Toplam etkinlik sayısını bul (Sayfalama arayüzü için gerekli)
    const total = await Event.countDocuments(filters);
    
    return { 
      events, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit) 
    };
  }

  // 3. READ (Tekil Okuma - ID'ye göre detay getirme)
  async findById(id) {
    await dbConnect();
    const event = await Event.findById(id);
    return event;
  }

  // 4. UPDATE (Kısmi Güncelleme)
  async update(id, updateData) {
    await dbConnect();
    // { new: true } ayarı, güncelleme yapıldıktan sonra eski veriyi değil, yeni veriyi döndürür
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true // Entity'deki kuralları (max uzunluk vb.) güncellemede de çalıştır
    });
    return updatedEvent;
  }

  // 5. DELETE (Silme)
  async delete(id) {
    await dbConnect();
    const deletedEvent = await Event.findByIdAndDelete(id);
    return deletedEvent;
  }
}

// Sınıfı tekil bir nesne (singleton) olarak dışa aktarıyoruz
export default new EventRepository();