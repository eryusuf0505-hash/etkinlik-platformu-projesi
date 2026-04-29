import mongoose from 'mongoose';
import Community from '../features/communities/Community.model.js';
import User from '../features/auth/User.model.js';

const allMockCommunities = [
  { _id: '662000000000000000000001', name: 'Modifiye & Drift TR', members: 4520, category: 'Otomobil', icon: '🏎️', description: 'JDM, modifiye ve drift tutkunlarının Türkiye\'deki en büyük buluşma noktası.' },
  { _id: '662000000000000000000002', name: 'AI & Future Tech', members: 8900, category: 'Teknoloji', icon: '🤖', description: 'Yapay zeka, makine öğrenmesi ve geleceğin teknolojileri.' },
  { _id: '662000000000000000000003', name: 'Digital Nomads Turkey', members: 2100, category: 'Yaşam', icon: '🌍', description: 'Dünyayı gezerken çalışanların yardımlaşma platformu.' },
  { _id: '662000000000000000000004', name: 'Crossfit Community', members: 4200, category: 'Spor', icon: '🏋️', description: 'Yüksek yoğunluklu antrenman ve sağlıklı yaşam.' },
  { _id: '662000000000000000000005', name: 'E-Sports Arena', members: 12000, category: 'Oyun', icon: '🎮', description: 'Turnuvalar, takım eşleşmeleri ve profesyonel gaming.' }
];

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/etkinlik_db');
    console.log('Connected to DB...');

    // Find an admin user to be the owner
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        admin = await User.findOne();
    }
    
    if (!admin) {
        console.error('No user found to assign as owner. Please register a user first.');
        process.exit(1);
    }

    for (const comm of allMockCommunities) {
      const exists = await Community.findById(comm._id);
      if (!exists) {
        await Community.create({
          ...comm,
          owner: admin._id
        });
        console.log(`Created: ${comm.name}`);
      } else {
        console.log(`Exists: ${comm.name}`);
      }
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
