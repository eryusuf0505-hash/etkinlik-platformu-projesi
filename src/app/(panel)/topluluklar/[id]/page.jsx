'use client';

import { useState } from 'react';
import Navbar from '@/shared/components/Navbar';

export default function CommunityDetailPage({ params }) {
  const [activeTab, setActiveTab] = useState('sohbet'); // akis, sohbet, etkinlikler
  const [message, setMessage] = useState('');

  const community = {
    name: 'Modifiye & Drift TR',
    members: 4520,
    icon: '🏎️',
    description: 'Türkiye\'nin en büyük otomobil tutkunları topluluğu. Teknik bilgiler, buluşmalar ve dahası.',
  };

  const chatMessages = [
    { user: 'Ahmet Y.', text: 'Hafta sonu pist günü var mı?', time: '14:20', avatar: 'AY' },
    { user: 'Caner K.', text: 'Evet, Körfez pistindeyiz!', time: '14:22', avatar: 'CK' },
    { user: 'Selim T.', text: 'Yeni egzoz sistemini deneyen var mı?', time: '14:30', avatar: 'ST' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Side: Community Info */}
          <aside className="w-full lg:w-80 space-y-6">
            <div className="glass p-10 rounded-[3rem] text-center">
              <div className="w-24 h-24 mx-auto bg-white/5 border border-white/10 rounded-[2rem] flex items-center justify-center text-5xl mb-6 shadow-2xl">
                {community.icon}
              </div>
              <h1 className="text-2xl font-black mb-2">{community.name}</h1>
              <p className="text-gray-500 text-sm font-bold mb-6 uppercase tracking-widest">{community.members.toLocaleString()} Üye</p>
              <button className="w-full py-4 rounded-2xl bg-white text-black font-black text-sm hover:bg-purple-600 hover:text-white transition-all shadow-xl shadow-white/5">
                AYRIL
              </button>
            </div>

            <div className="glass p-8 rounded-[2.5rem]">
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">Hakkımızda</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {community.description}
              </p>
            </div>
          </aside>

          {/* Right Side: Dynamic Content */}
          <div className="flex-1 space-y-8">
            {/* Tabs */}
            <div className="flex p-2 bg-white/5 border border-white/5 rounded-[2rem]">
              {['Akış', 'Sohbet', 'Etkinlikler'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`flex-1 py-4 rounded-[1.5rem] text-sm font-black transition-all ${
                    activeTab === tab.toLowerCase() 
                      ? 'bg-purple-600 text-white shadow-lg' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Chat View */}
            {activeTab === 'sohbet' && (
              <div className="glass rounded-[3rem] flex flex-col h-[600px] overflow-hidden">
                <div className="flex-1 p-8 overflow-y-auto space-y-6 no-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="flex items-start gap-4 animate-in slide-in-from-bottom-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-[10px] font-black shrink-0">
                        {msg.avatar}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-black text-white">{msg.user}</span>
                          <span className="text-[10px] font-bold text-gray-500">{msg.time}</span>
                        </div>
                        <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none max-w-md">
                          <p className="text-sm text-gray-300 font-medium">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 bg-black/20 border-t border-white/5">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Mesajını yaz..."
                      className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-purple-600 text-white rounded-xl text-[10px] font-black hover:bg-purple-500 transition-all">
                      GÖNDER
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Events View */}
            {activeTab === 'etkinlikler' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map(i => (
                  <div key={i} className="glass p-8 rounded-[2.5rem] group hover:border-purple-500/50 transition-all">
                    <div className="text-3xl mb-6">🏁</div>
                    <h4 className="text-xl font-black mb-2">Haftalık Pist Günü #{i}</h4>
                    <p className="text-gray-400 text-sm mb-6">Sadece topluluk üyelerine özel, Körfez pistinde buluşuyoruz.</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-xs font-black text-purple-400 uppercase tracking-widest">24 TEMMUZ</span>
                      <button className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black hover:bg-purple-600 hover:text-white transition-all">KATIL</button>
                    </div>
                  </div>
                ))}
                <div className="border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-white/5 transition-all group">
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">+</span>
                  <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Yeni Etkinlik Oluştur</span>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
