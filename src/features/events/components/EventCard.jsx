'use client';

export default function EventCard({ event }) {
  return (
    <div className="group relative glass rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-500 hover:shadow-blue-500/10">
      <div className="aspect-[16/10] w-full bg-gray-800 relative overflow-hidden">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <span className="text-gray-700 text-6xl opacity-20">EVENT</span>
          </div>
        )}
        
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="px-4 py-1.5 rounded-xl bg-blue-600 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg shadow-blue-500/20">
            {event.category?.name || 'Etkinlik'}
          </span>
          {event.is_new && (
            <span className="px-4 py-1.5 rounded-xl bg-emerald-500 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
              YENİ
            </span>
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="flex items-center gap-3 text-xs font-bold text-blue-400 mb-4 tracking-wide uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {new Date(event.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
          </span>
          <span className="opacity-30">|</span>
          <span>{event.city}</span>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors line-clamp-1">
          {event.title}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
          {event.description}
        </p>
        
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-2xl border-4 border-[#0f172a] bg-gradient-to-br from-gray-700 to-gray-800 ring-1 ring-white/10" />
            ))}
            <div className="w-10 h-10 rounded-2xl border-4 border-[#0f172a] bg-blue-600 flex items-center justify-center text-[10px] font-black ring-1 ring-white/10 shadow-lg shadow-blue-500/20">
              +42
            </div>
          </div>
          
          <button className="h-12 px-6 rounded-2xl bg-white text-black text-sm font-bold hover:bg-blue-400 hover:text-white transition-all shadow-xl shadow-white/5">
            Bilet Al
          </button>
        </div>
      </div>
    </div>
  );
}
