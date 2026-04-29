import mongoose from 'mongoose';
import Community from '../features/communities/Community.model.js';
import User from '../features/auth/User.model.js';

const allMockCommunities = [
  { _id: '662000000000000000000001', name: 'Modifiye & Drift TR', memberCount: 4520, category: 'Otomobil', icon: '🏎️', description: 'JDM, modifiye ve drift tutkunlarının Türkiye\'deki en büyük buluşma noktası.' },
  { _id: '662000000000000000000002', name: 'AI & Future Tech', memberCount: 8900, category: 'Teknoloji', icon: '🤖', description: 'Yapay zeka, makine öğrenmesi ve geleceğin teknolojileri.' },
  { _id: '662000000000000000000003', name: 'Digital Nomads Turkey', memberCount: 2100, category: 'Yaşam', icon: '🌍', description: 'Dünyayı gezerken çalışanların yardımlaşma platformu.' },
  { _id: '662000000000000000000004', name: 'Crossfit Community', memberCount: 4200, category: 'Spor', icon: '🏋️', description: 'Yüksek yoğunluklu antrenman ve sağlıklı yaşam.' },
  { _id: '662000000000000000000005', name: 'E-Sports Arena', memberCount: 12000, category: 'Oyun', icon: '🎮', description: 'Turnuvalar, takım eşleşmeleri ve profesyonel gaming.' }
];

async function seed() {
  try {
    const connectionUri = 'mongodb://127.0.0.1:27017/etkinlik_db';
    await mongoose.connect(connectionUri);
    console.log('✅ Veritabanına bağlanıldı.');

    // Sahibi olacak bir kullanıcı bul (admin veya ilk kullanıcı)
    let owner = await User.findOne({ role: 'admin' });
    if (!owner) owner = await User.findOne();
    
    if (!owner) {
      console.error('❌ Hata: Sahip olarak atanacak kullanıcı bulunamadı. Lütfen önce kayıt olun.');
      process.exit(1);
    }

    console.log(`👤 Topluluk sahibi olarak atanan kullanıcı: ${owner.email}`);

    for (const comm of allMockCommunities) {
      const exists = await Community.findOne({ name: comm.name });
      if (!exists) {
        await Community.create({
          ...comm,
          owner: owner._id,
          members: []
        });
        console.log(`➕ Oluşturuldu: ${comm.name}`);
      } else {
        console.log(`ℹ️ Zaten var: ${comm.name}`);
      }
    }

    console.log('✅ Seeding işlemi tamamlandı.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding hatası:', err);
    process.exit(1);
  }
}

seed();
