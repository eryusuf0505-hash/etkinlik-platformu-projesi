import mongoose from 'mongoose';

// 1. ŞEMA (SCHEMA) OLUŞTURMA
// Bu kısım, veritabanımızda (MongoDB) bir "Etkinlik" kaydının hangi alanlara sahip olacağını 
// ve bu alanların veri tiplerini (String, Date, Number vb.) belirlediğimiz yerdir.
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Etkinlik başlığı zorunludur.'],
      trim: true, // Başındaki ve sonundaki boşlukları otomatik temizler
      maxlength: [100, 'Başlık en fazla 100 karakter olabilir.']
    },
    description: {
      type: String,
      required: [true, 'Etkinlik açıklaması zorunludur.']
    },
    date: {
      type: Date,
      required: [true, 'Etkinlik tarihi zorunludur.']
    },
    location: {
      type: String,
      required: [true, 'Etkinlik konumu zorunludur.']
    },
    capacity: {
      type: Number,
      required: [true, 'Katılımcı kapasitesi belirtilmelidir.'],
      min: [1, 'Kapasite en az 1 kişi olmalıdır.']
    },
    // İleride buraya "organizer" (düzenleyen kişi) ID'si gibi ilişkisel veriler de ekleyeceğiz.
  },
  {
    // timestamps özelliği sayesinde her etkinlik oluşturulduğunda 'createdAt' (oluşturulma tarihi) 
    // ve güncellendiğinde 'updatedAt' (güncellenme tarihi) alanları otomatik olarak eklenir.
    timestamps: true 
  }
);

// 2. MODEL (ENTITY) OLUŞTURMA VE DIŞA AKTARMA
// Next.js hot-reload (sürekli yenileme) yaparken modelin defalarca oluşturulup 
// hata vermesini engellemek için önce veritabanında 'Event' modeli var mı diye kontrol ediyoruz.
// Varsa onu kullanıyoruz (mongoose.models.Event), yoksa yeni baştan oluşturuyoruz.
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);

export default Event;