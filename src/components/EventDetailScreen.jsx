import { ArrowLeft, Zap, MessageCircle, Share2, MapPin, Users, Heart } from 'lucide-react';
import { useVibe } from '../context/VibeContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'motion/react';

export const EventDetailScreen = ({ event, onBack, onSave }) => {
    // Check event exists FIRST before using hooks
    if (!event) return null;

    const { openVibeCheck } = useVibe();

    // Mock Similar Events
    const similarEvents = [
        { id: 'sim-1', title: 'Afterwork Chill', image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=200' },
        { id: 'sim-2', title: 'Rooftop Vibes', image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=200' },
        { id: 'sim-3', title: 'Jazz & Wine', image: 'https://images.unsplash.com/photo-1514525253440-b393452e3383?w=200' },
    ];


    return (
        <div className="fixed inset-0 z-50 bg-gray-950 overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Header / Image */}
            <div className="relative h-[45vh] w-full">
                <ImageWithFallback src={event.imageUrl} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent"></div>

                {/* Navbar */}
                <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between pt-12">
                    <button onClick={onBack} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                            <Share2 size={18} />
                        </button>
                        <button onClick={onSave} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                            <Heart size={18} />
                        </button>
                    </div>
                </div>

                {/* Title & Host Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wide">
                            {event.category || 'Evento'}
                        </span>
                        <div className="bg-black/60 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 text-xs text-white border border-white/10">
                            <Users size={12} />
                            {event.engagement?.attending || event.attendees || 0} confirmados
                        </div>
                    </div>
                    <h1 className="text-3xl font-black text-white leading-tight mb-2 drop-shadow-md">
                        {event.title}
                    </h1>
                    <div className="flex items-center gap-2">
                        <img src={event.creator?.avatar || 'https://via.placeholder.com/40'} className="w-6 h-6 rounded-full border border-white" />
                        <span className="text-gray-200 text-sm font-medium">por {event.creator?.name || 'Anfitrión'}</span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-5 py-6 space-y-8 pb-24">

                {/* Action Buttons Row */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/5">
                        <MessageCircle size={20} className="text-blue-400" />
                        Chat Grupo
                    </button>
                    <button
                        onClick={() => openVibeCheck('event', event.id, event.title)}
                        className="bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/5"
                    >
                        <Zap size={20} className="text-yellow-400 fill-current" />
                        Vibe Check
                    </button>
                </div>

                {/* Info Block */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-3">Información</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                                <MapPin size={20} className="text-gray-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">{event.location?.name || 'Ubicación secreta'}</h4>
                                <p className="text-gray-500 text-sm">{event.location?.distance || 'Cerca de ti'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Events (Suggested) */}
                <div>
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        Similares <span className="text-gray-600 font-normal text-sm">Basado en tus vibes</span>
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar">
                        {similarEvents.map(sim => (
                            <div key={sim.id} className="min-w-[140px] relative rounded-xl overflow-hidden aspect-[3/4] group">
                                <ImageWithFallback src={sim.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
                                    <p className="text-white font-bold text-sm leading-tight">{sim.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 z-50">
                <button className="w-full bg-white text-black font-black py-4 rounded-full shadow-lg shadow-white/10 active:scale-95 transition-transform">
                    {event.endsIn ? '¡Voy ahora!' : 'Apuntarme'}
                </button>
            </div>
        </div>
    );
};
