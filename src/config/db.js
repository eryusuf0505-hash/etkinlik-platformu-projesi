import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  let connectionUri = MONGODB_URI;

  // Eğer Atlas adresi geçersizse, yerel MongoDB'yi (localhost) dene
  if (!connectionUri || connectionUri.includes('kullanici_adi:sifre')) {
    console.warn('UYARI: MongoDB Atlas adresi ayarlanmamış. Yerel (localhost) bağlantı deneniyor...');
    connectionUri = 'mongodb://127.0.0.1:27017/etkinlik_db';
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 saniye sonra zaman aşımına uğra
    };

    cached.promise = mongoose.connect(connectionUri, opts).then((mongoose) => {
      console.log('✅ Veri tabanı bağlantısı başarılı:', connectionUri.includes('127.0.0.1') ? 'Lokal MongoDB' : 'MongoDB Atlas');
      return mongoose;
    }).catch(err => {
      if (connectionUri.includes('127.0.0.1')) {
        throw new Error('VERİTABANI HATASI: Ne Atlas ne de Yerel MongoDB bağlantısı sağlanamadı. Lütfen MongoDB\'nin bilgisayarınızda çalıştığından veya .env.local dosyasındaki Atlas bilgilerinizin doğruluğundan emin olun.');
      }
      throw err;
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