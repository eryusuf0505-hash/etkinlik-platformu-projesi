'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/shared/components/Navbar';

export default function MessagesPage() {
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [activeCommunity, setActiveCommunity] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]); 
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMe = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setCurrentUser(null);
        setJoinedCommunities([]);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          const joined = user.joinedCommunities || [];
          setJoinedCommunities(joined);
          if (joined.length > 0) {
            setActiveCommunity(joined[0]);
          }
        } else {
          // If token invalid, clear it
          localStorage.removeItem('token');
          setCurrentUser(null);
          setJoinedCommunities([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (!activeCommunity || !currentUser) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/communities/${activeCommunity._id || activeCommunity.name}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [activeCommunity, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeCommunity || !currentUser) return;

    const currentText = messageText;
    setMessageText('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/communities/${activeCommunity._id || activeCommunity.name}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: currentText })
      });
      
      if (res.ok) {
        const newMessage = await res.json();
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== messageId));
      } else {
        const data = await res.json();
        alert(data.error || 'Mesaj silinemedi.');
      }
    } catch (err) {
      console.error(err);
      alert('Bağlantı hatası.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 flex h-[calc(100vh-6rem)]">
        {!currentUser && !loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center glass rounded-[3rem] p-10">
            <div className="text-8xl mb-8">🔒</div>
            <h2 className="text-3xl font-black text-white mb-4">Mesajlara Erişmek İçin Giriş Yapın</h2>
            <p className="text-gray-400 max-w-md mb-10 font-medium">
              Topluluklardaki sohbetlere katılmak ve mesaj geçmişinizi görüntülemek için bir hesabınızın olması ve giriş yapmanız gerekmektedir.
            </p>
            <Link href="/login" className="px-10 py-5 rounded-2xl bg-purple-600 text-white font-black hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/20 active:scale-95">
              Giriş Yap
            </Link>
          </div>
        ) : loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Left Sidebar: Community List */}
            <div className="w-full md:w-80 glass rounded-l-[2rem] border-r border-white/5 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-xl font-black text-white">Sohbetler</h2>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
                {joinedCommunities.length === 0 ? (
                  <div className="text-center p-6 text-gray-400">
                    <div className="text-4xl mb-4">💬</div>
                    <p className="text-sm font-medium mb-4">Henüz hiçbir topluluğa katılmadınız.</p>
                    <Link href="/topluluklar" className="text-purple-400 text-xs font-bold hover:underline">
                      Toplulukları Keşfet
                    </Link>
                  </div>
                ) : (
                  joinedCommunities.filter(c => c !== null).map(comm => (
                    <button
                      key={comm.name}
                      onClick={() => setActiveCommunity(comm)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                        activeCommunity?.name === comm.name 
                          ? 'bg-purple-600/20 border border-purple-500/30' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                        {comm.icon}
                      </div>
                      <div className="flex-1 text-left overflow-hidden">
                        <h3 className="text-sm font-bold text-white truncate">{comm.name}</h3>
                        <p className="text-xs text-gray-400 truncate mt-1">
                          Sohbete gitmek için tıkla...
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Right Content: Chat Area */}
            <div className="flex-1 glass rounded-r-[2rem] flex flex-col overflow-hidden relative">
              {!activeCommunity ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                  <span className="text-6xl mb-6 opacity-20">👋</span>
                  <p className="font-medium text-center px-6">Mesajlaşmaya başlamak için sol taraftan bir topluluk seçin veya <Link href="/topluluklar" className="text-purple-400 font-bold hover:underline">yenilerine katılın</Link>.</p>
                </div>
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-xl z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-xl">
                        {activeCommunity.icon}
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-white">{activeCommunity.name}</h2>
                        <p className="text-xs text-gray-400 font-medium">{activeCommunity.members?.toLocaleString() || 0} Üye</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    {messages.map((msg) => {
                      const isMe = currentUser && msg.user && (msg.user._id === (currentUser._id || currentUser.id));
                      const timeStr = new Date(msg.olusturulma_tarihi || msg.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <div key={msg._id} className={`flex items-start gap-4 ${isMe ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2`}>
                          {!isMe && (
                            <div className="w-8 h-8 rounded-full bg-pink-600/20 flex items-center justify-center text-[10px] font-black shrink-0 text-pink-400 border border-pink-500/20">
                              {msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                          <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                            <div className={`flex items-center gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                              <span className="text-xs font-bold text-gray-300">{isMe ? 'Sen' : msg.user?.name || 'Kullanıcı'}</span>
                              <span className="text-[9px] text-gray-500">{timeStr}</span>
                            </div>
                            <div className={`border p-3 rounded-2xl max-w-md inline-block text-left relative group/msg ${
                              isMe 
                                ? 'bg-purple-600 border-purple-500 text-white rounded-tr-none' 
                                : 'bg-white/10 border-white/5 text-gray-200 rounded-tl-none'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                              
                              {/* Delete button for admin or owner */}
                              {(currentUser?.role === 'admin' || isMe) && (
                                <button 
                                  onClick={() => handleDeleteMessage(msg._id)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover/msg:opacity-100 transition-opacity shadow-lg hover:scale-110"
                                  title="Mesajı Sil"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-6 bg-white/5 border-t border-white/5">
                    <form onSubmit={handleSendMessage} className="relative flex items-center">
                      <input 
                        type="text" 
                        placeholder="Bir mesaj yazın..."
                        className="w-full bg-[#0f172a] border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                      />
                      <button 
                        type="submit"
                        className="absolute right-2 w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-500 transition-colors shadow-lg"
                        disabled={!messageText.trim() || !currentUser}
                      >
                        ➤
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
