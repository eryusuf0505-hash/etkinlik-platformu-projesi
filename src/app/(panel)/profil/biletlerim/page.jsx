'use client';

import Navbar from '@/shared/components/Navbar';
import ProfileSidebar from '@/shared/components/ProfileSidebar';

export default function MyTicketsPage() {
  const tickets = [
    { 
      id: 'TCK-9281', 
      title: 'Afterlife Istanbul', 
      date: '15 Ağu 2024', 
      time: '22:00',
      location: 'Klein Phönix', 
      status: 'Aktif',
      color: 'blue'
    },
    { 
      id: 'TCK-8812', 
      title: 'Tech Summit 2024', 
      date: '20 Eyl 2024', 
      time: '09:00',
      location: 'Congresium Ankara', 
      status: 'Beklemede',
      color: 'purple'
    },
    { 
      id: 'TCK-7710', 
      title: 'Gastronomi Festivali', 
      date: '05 Eki 2024', 
      time: '11:00',
      location: 'İzmir Arena', 
      status: 'Tamamlandı',
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <ProfileSidebar />

          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-4xl font-black">Biletlerim</h1>
              <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm font-bold text-gray-400 hover:text-white transition-all">
                Geçmişi İndir (PDF)
              </button>
            </div>

            <div className="space-y-6">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="glass p-1 rounded-[3rem] group">
                  <div className="flex flex-col md:flex-row items-center p-8 gap-8">
                    {/* Visual QR Placeholder */}
                    <div className="w-32 h-32 bg-white rounded-[2rem] p-3 flex-shrink-0">
                      <div className="w-full h-full border-4 border-black border-dashed opacity-20" />
                    </div>

                    <div className="flex-1 space-y-2 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{ticket.id}</span>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          ticket.status === 'Aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-black">{ticket.title}</h2>
                      <p className="text-gray-400 font-medium">{ticket.location} • {ticket.date} @ {ticket.time}</p>
                    </div>

                    <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                      <button className="flex-1 md:w-40 py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-blue-400 hover:text-white transition-all">
                        QR GÖSTER
                      </button>
                      <button className="flex-1 md:w-40 py-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold hover:bg-white/10 transition-all">
                        DETAYLAR
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
