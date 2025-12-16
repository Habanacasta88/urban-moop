import { MapPin, Clock, User, Shield, Check, MessageCircle, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

// New Host Badges
const HostBadge = ({ level }) => {
    if (level === 'ambassador') {
        return (
            <div className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-purple-200 flex items-center gap-1">
                <span className="text-lg">⚡️</span> Embajador
            </div>
        );
    }
    if (level === 'power') {
        return (
            <div className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-black border border-blue-200 flex items-center gap-1">
                <span className="text-lg">🚀</span> Host Top
            </div>
        );
    }
    return null; // Normal hosts don't get a top badge, simplified
};

export const MoopCard = ({ moop, onJoin, onChat, showStatus = false }) => {
    // moop object should match the new schema structure roughly
    // { title, emoji, category, host: { name, avatar, level }, timeText, distance, attendees, maxAttendees, ... }

    const isFull = moop.attendees >= moop.maxAttendees;
    const seatsLeft = moop.maxAttendees - moop.attendees;

    // Category visual mapping
    const getCategoryStyle = (cat) => {
        // Simplified mapping based on new 7 categories
        switch (cat) {
            case 'coffee_chat': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'aesthetic_walk': return 'bg-pink-50 text-pink-700 border-pink-100';
            case 'running': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'vermut': return 'bg-red-50 text-red-700 border-red-100';
            case 'dog_walk': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'creative': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'express': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const catStyle = getCategoryStyle(moop.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            className="group relative bg-white rounded-3xl p-5 mb-4 border border-gray-100 shadow-sm hover:shadow-md transition-all"
        >
            {/* Header: Icon + Title + Host */}
            <div className="flex gap-4 mb-4">
                {/* Mood Icon */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm border ${catStyle} bg-opacity-50`}>
                    {moop.emoji}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Host Line */}
                    <div className="flex items-center gap-2 mb-1">
                        <img src={moop.host.avatar || "https://ui-avatars.com/api/?name=User"} className="w-5 h-5 rounded-full object-cover border border-gray-200" alt={moop.host.name} />
                        <span className="text-xs font-bold text-gray-500 truncate">{moop.host.name}</span>
                        <HostBadge level={moop.host.level} />
                    </div>

                    {/* Title */}
                    <h3 className="font-black text-gray-900 text-lg leading-tight truncate pr-2">
                        {moop.title}
                    </h3>

                    {/* Time & Distance */}
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-gray-400">
                        <span className="flex items-center gap-1 text-gray-900 bg-gray-50 px-2 py-0.5 rounded-md">
                            <Clock size={12} className="text-gray-500" />
                            {moop.timeText}
                        </span>
                        <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {moop.distance}
                        </span>
                    </div>
                </div>
            </div>

            {/* Middle: Seats & Trust */}
            <div className="flex items-center justify-between mb-5 bg-gray-50/50 rounded-xl p-3 border border-gray-50">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">Disponibilidad</span>
                    <span className={`text-sm font-black ${seatsLeft <= 1 ? 'text-red-500' : 'text-gray-900'}`}>
                        {seatsLeft} de {moop.maxAttendees} plazas libres
                    </span>
                </div>

                {/* Avatars of joined (Mock) */}
                <div className="flex -space-x-2">
                    {moop.attendeesList?.slice(0, 3).map((a, i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={a.avatar} alt="att" className="w-full h-full object-cover" />
                        </div>
                    ))}
                    {moop.attendees > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            +{moop.attendees - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* CTA Button */}
            {showStatus ? (
                // If showing in "My Moops" with status
                <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-900 font-bold text-sm">
                        Ver Detalles
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                        Chat de Grupo
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => onJoin(moop)}
                    disabled={isFull}
                    className={`w-full py-3.5 rounded-xl font-black text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${isFull ? 'bg-gray-300 shadow-none cursor-not-allowed' : 'bg-[#5B4B8A] shadow-indigo-500/20'}`}
                >
                    {isFull ? (
                        <span>Completo 🚫</span>
                    ) : moop.joined ? (
                        <>
                            <MessageCircle size={18} /> Ir al Chat
                        </>
                    ) : (
                        <>
                            👉 Unirme ahora
                        </>
                    )}
                </button>
            )}

            {/* Security Badge Absolute */}
            <div className="absolute top-4 right-4 text-emerald-500/20">
                <Shield size={40} fill="currentColor" />
            </div>

        </motion.div>
    );
};
