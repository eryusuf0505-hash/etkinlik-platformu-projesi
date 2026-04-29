import mongoose from 'mongoose';
import Event from '../features/events/Event.model.js';
import Category from '../features/categories/Category.model.js';
import User from '../features/auth/User.model.js';
import Community from '../features/communities/Community.model.js';
import fs from 'fs';
import path from 'path';

let MONGODB_URI = 'mongodb://127.0.0.1:27017/etkinlik_db';

try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);
    if (match && match[1] && !match[1].includes('kullanici_adi')) {
      MONGODB_URI = match[1].trim();
    }
  }
} catch (e) {}

async function seed() {
  try {
    console.log('Veritabanına bağlanılıyor...');
    await mongoose.connect(MONGODB_URI);
    
    // Admin bul veya oluştur
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'Yusuf Er',
        email: 'yusuf@admin.com',
        password: 'admin_password_hash',
        role: 'admin'
      });
    }

    // Kategorileri hazırla (Etkinlikler için)
    const categoryNames = ['Konser', 'Teknoloji', 'Spor', 'Sanat', 'Otomobil', 'Yaşam', 'Oyun', 'Seminer'];
    const categoryMap = {};
    for (const name of categoryNames) {
      let cat = await Category.findOne({ name });
      if (!cat) cat = await Category.create({ name, slug: name.toLowerCase() });
      categoryMap[name] = cat._id;
    }

    // Temizlik
    console.log('Temizlik yapılıyor...');
    await Event.deleteMany({});
    await Community.deleteMany({});

    // Topluluklar
    console.log('Topluluklar oluşturuluyor...');
    const communities = [
      { name: 'Yazılım Dünyası', category: 'Teknoloji', icon: '💻', description: 'Geliştiriciler, tasarımcılar ve teknoloji meraklıları için en büyük buluşma noktası.', owner: admin._id, memberCount: 1250 },
      { name: 'Hız Tutkunları', category: 'Otomobil', icon: '🏎️', description: 'Modifiye, yarış ve otomobil kültürüne dair her şey burada.', owner: admin._id, memberCount: 840 },
      { name: 'Sağlıklı Yaşam', category: 'Yaşam', icon: '🌿', description: 'Beslenme, yoga ve sürdürülebilir yaşam üzerine paylaşımlar.', owner: admin._id, memberCount: 2100 },
      { name: 'E-Spor Akademi', category: 'Oyun', icon: '🎮', description: 'Rekabetçi oyunlar ve e-spor dünyasına dair her şey.', owner: admin._id, memberCount: 3500 },
      { name: 'Basketbol Severler', category: 'Spor', icon: '🏀', description: 'Saha buluşmaları ve maç analizleri.', owner: admin._id, memberCount: 450 },
      { name: 'Fırça Darbesi', category: 'Sanat', icon: '🎨', description: 'Sanatın her dalıyla ilgilenenler için yaratıcı bir alan.', owner: admin._id, memberCount: 320 }
    ];
    const createdCommunities = await Community.insertMany(communities);

    // Etkinlikler
    console.log('Etkinlikler oluşturuluyor...');
    const events = [
      {
        title: 'Afterlife Istanbul 2024',
        description: 'Tale Of Us presents Afterlife. Eşsiz bir görsel şov ve kesintisiz müzik deneyimi.',
        category: categoryMap['Konser'],
        city: 'İstanbul',
        date: new Date('2024-08-15'),
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop',
        price: 1500,
        organizer: admin._id,
        community: createdCommunities[0]._id,
        is_new: true
      },
      {
        title: 'Intercity Pist Günleri',
        description: 'Kendi aracınla F1 pistinde gazlama şansı. Adrenalin dolu bir gün.',
        category: categoryMap['Otomobil'],
        city: 'İstanbul',
        date: new Date('2024-09-10'),
        imageUrl: 'https://images.unsplash.com/photo-1541890289-b86df5bafd81?q=80&w=1974&auto=format&fit=crop',
        price: 2500,
        organizer: admin._id,
        community: createdCommunities[1]._id,
        is_new: true
      },
      {
        title: 'Global Tech Summit',
        description: 'AI, Web3 ve Metaverse geleceği bu zirvede tartışılıyor.',
        category: categoryMap['Teknoloji'],
        city: 'Ankara',
        date: new Date('2024-10-20'),
        imageUrl: 'https://images.unsplash.com/photo-1540575861501-7ad0582373f0?q=80&w=2070&auto=format&fit=crop',
        price: 500,
        organizer: admin._id,
        community: createdCommunities[0]._id
      },
      {
        title: 'Ege Rallisi Finali',
        description: 'Toz ve duman içinde nefes kesen bir yarış deneyimi.',
        category: categoryMap['Spor'],
        city: 'İzmir',
        date: new Date('2024-11-05'),
        imageUrl: 'https://images.unsplash.com/photo-1530681954419-7979fa474556?q=80&w=2070&auto=format&fit=crop',
        price: 0,
        organizer: admin._id,
        community: createdCommunities[4]._id
      },
      {
        title: 'Modern Sanat Bienali',
        description: 'Galata\'nın tarihi atmosferinde sanatla iç içe bir hafta.',
        category: categoryMap['Sanat'],
        city: 'İstanbul',
        date: new Date('2024-07-12'),
        imageUrl: 'https://images.unsplash.com/photo-1492037766660-2a56f9eb3fcb?q=80&w=2070&auto=format&fit=crop',
        price: 150,
        organizer: admin._id,
        community: createdCommunities[5]._id
      },
      {
        title: 'Valorant Pro League',
        description: 'Büyük final heyecanı! En iyi takımlar kupa için yarışıyor.',
        category: categoryMap['Oyun'],
        city: 'Eskişehir',
        date: new Date('2024-08-30'),
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        price: 100,
        organizer: admin._id,
        community: createdCommunities[3]._id,
        is_new: true
      },
      {
        title: 'Ruh ve Beden Kampı',
        description: 'Doğanın kalbinde huzur dolu 3 gün.',
        category: categoryMap['Yaşam'],
        city: 'Muğla',
        date: new Date('2024-06-20'),
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
        price: 4500,
        organizer: admin._id,
        community: createdCommunities[2]._id
      },
      {
        title: 'Startup Networking Meetup',
        description: 'Girişimciler ve melek yatırımcılar bu akşam buluşuyor.',
        category: categoryMap['Teknoloji'],
        city: 'İstanbul',
        date: new Date('2024-07-25'),
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=2070&auto=format&fit=crop',
        price: 200,
        organizer: admin._id,
        community: createdCommunities[0]._id
      },
      {
        title: 'Anadolu Rock Festivali',
        description: 'Efsane şarkılar, unutulmaz bir gece.',
        category: categoryMap['Konser'],
        city: 'Bursa',
        date: new Date('2024-09-05'),
        imageUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop',
        price: 600,
        organizer: admin._id
      },
      {
        title: 'Klasik Araçlar Geçidi',
        description: 'Otomobil tarihinin incilerini yakından görün.',
        category: categoryMap['Otomobil'],
        city: 'Antalya',
        date: new Date('2024-10-15'),
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop',
        price: 250,
        organizer: admin._id,
        community: createdCommunities[1]._id
      }
    ];

    await Event.insertMany(events);
    console.log('✅ 10 Etkinlik ve 6 Topluluk başarıyla oluşturuldu!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed hatası:', error);
    process.exit(1);
  }
}

seed();
