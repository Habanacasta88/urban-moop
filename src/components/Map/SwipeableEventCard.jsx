import { motion, useMotionValue, useTransform } from 'motion/react';
import { MapPin, Users, ChevronRight, ChevronLeft, Zap } from 'lucide-react';

export const SwipeableEventCard = ({ event, onNext, onPrev, onClick }) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-100, 0, 100], [-5, 0, 5]);

    const handleDragEnd = (e, { offset, velocity }) => {
        const swipeThreshold = 50;
        if (offset.x > swipeThreshold) {
            onPrev();
        } else if (offset.x < -swipeThreshold) {
            onNext();
        }
    };

    if (!event) return null;

    return (
        <div className="absolute bottom-24 left-0 right-0 px-4 z-20 flex justify-center perspective-1000">
            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 50, opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{ x, opacity, rotate }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2} // Bouncy feeling
                onDragEnd={handleDragEnd}
                onClick={onClick}
                className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/60 relative"
            >
                {/* Micro Label */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-500 to-indigo-500 opacity-20" />

                <div className="flex h-36">
                    {/* Image Section / Prev Trigger */}
                    <div
                        className="w-1/3 relative h-full cursor-pointer group"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    >
                        {/* Hover Hint */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                            <ChevronLeft size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                        <img
                            src={event.image || event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />
                        {/* Status Badge */}
                        {event.isFlash && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-yellow-200 flex items-center gap-1 transform -rotate-2">
                                <Zap size={8} fill="black" /> FLASH
                            </div>
                        )}
                        {event.type === 'moop' && (
                            <div className="absolute top-2 left-2 bg-cyan-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                                <Users size={10} /> MOOP
                            </div>
                        )}
                        {/* Live Indicator */}
                        <div className="absolute bottom-2 left-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="w-2/3 p-4 flex flex-col justify-between relative bg-white">
                        {/* Hint for Swipe / Next Button */}
                        <div
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer hover:bg-black/5 active:bg-black/10 transition-colors z-10"
                        >
                            <ChevronRight size={24} className="text-gray-300" />
                        </div>

                        <div>
                            {/* Recommendation Label */}
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100 uppercase tracking-wide flex items-center gap-1">
                                    ✨ Recomendado para ti ahora
                                </span>
                            </div>

                            <h3 className="font-excep font-black text-gray-900 text-lg leading-tight line-clamp-2 mb-1">
                                {event.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                <MapPin size={12} className="text-gray-400" />
                                <span className="truncate">{event.location?.name || event.location}</span>
                            </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="flex items-end justify-between mt-2">
                            <div className="flex items-center gap-3">
                                {event.attendees && (
                                    <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                        <Users size={12} className="text-gray-400" />
                                        <span className="text-xs font-bold text-gray-700">{event.attendees}</span>
                                    </div>
                                )}
                                {event.endsIn && (
                                    <div className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                                        ⏱ {event.endsIn}
                                    </div>
                                )}
                            </div>

                            <button className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg active:scale-95 transition-transform">
                                Ver más
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
