import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  const MONGODB_URI = process.env.MONGODB_URI;
  console.log('MONGODB_URI:', MONGODB_URI);

  let connectionUri = MONGODB_URI;
  if (!connectionUri || connectionUri.includes('kullanici_adi:sifre')) {
    console.warn('UYARI: MongoDB Atlas adresi ayarlanmamış. Yerel (localhost) bağlantı deneniyor...');
    connectionUri = 'mongodb://127.0.0.1:27017/etkinlik_db';
  }

  console.log('Connecting to:', connectionUri);

  try {
    await mongoose.connect(connectionUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connection successful!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
