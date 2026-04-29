import mongoose from 'mongoose';

// Güvenlik için veritabanı bağlantı adresimizi dışarıdan (çevresel değişkenlerden) alıyoruz.
// Böylece şifremiz kodların içinde açıkça görünmüyor.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('HATA: Lütfen .env.local dosyasına MONGODB_URI değişkenini ekleyin.');
}

// Next.js geliştirme aşamasında (hot-reload) sayfayı her kaydettiğimizde
// veritabanına yeni bir bağlantı açıp sistemi çökertmesin diye "önbelleğe alma" (caching) yapıyoruz.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Eğer daha önceden kurulmuş aktif bir bağlantı varsa, yenisini açmak yerine onu kullan.
  // Bu, sitemizin çok daha hızlı ve performanslı çalışmasını sağlar.
  if (cached.conn) {
    return cached.conn;
  }

  // Eğer bağlantı henüz yoksa, yeni bir bağlantı isteği oluştur.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB veritabanı bağlantısı başarıyla kuruldu!");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;