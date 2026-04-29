import Navbar from '@/shared/components/Navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f172a]">
      {/* Background Orbs / Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]" />
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-8 mb-24">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-none">
              DÜNYAYI <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                KEŞFETMEYE BAŞLA
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-xl text-gray-400 font-medium">
              Binlerce etkinlik, yüzlerce topluluk ve sınırsız eğlence. 
              İlgi alanlarına uygun insanlarla tanış, sosyalleş ve hayatına renk kat.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kesfet" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg transition-all shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95">
                Etkinlikleri Keşfet
              </Link>
              <Link href="/topluluklar" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-lg transition-all border border-white/10 backdrop-blur-sm">
                Topluluklara Katıl
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🎫
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Eşsiz Etkinlikler</h3>
              <p className="text-gray-400 leading-relaxed">
                Konserlerden teknoloji zirvelerine kadar her zevke hitap eden binlerce etkinlik seni bekliyor.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🤝
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Güçlü Topluluklar</h3>
              <p className="text-gray-400 leading-relaxed">
                İlgi alanlarını paylaşan topluluklara katıl, bilgi alışverişinde bulun ve ağını genişlet.
              </p>
            </div>

            <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 group">
              <div className="w-16 h-16 bg-pink-600/20 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:scale-110 transition-transform">
                🗓️
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Kişisel Takvim</h3>
              <p className="text-gray-400 leading-relaxed">
                Katıldığın etkinlikleri düzenle, hiçbirini kaçırma ve programını kolayca yönet.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer-like element */}
      <div className="text-center py-20 opacity-30 text-sm font-medium tracking-widest uppercase">
        Built with Premium Design for Etkinlik Platformu
      </div>
    </div>
  );
}
