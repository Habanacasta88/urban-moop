import { motion, useMotionValue, useTransform } from 'motion/react';
import { MapPin, Clock, ChevronRight, ChevronLeft, Zap } from 'lucide-react';

export const SwipeableEventCard = ({ event, distance, onNext, onPrev, onClick }) => {
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

    // Determine if event is happening now or in future
    const isNow = !event.rawStartTime || new Date(event.rawStartTime) <= new Date();
    const timeLabel = isNow ? 'Ahora' : event.time || 'Hoy';

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
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                onClick={onClick}
                className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-white/60 relative"
            >
                {/* Top Accent */}
                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-brand-500 to-brand-300 opacity-30" />

                <div className="flex h-36">
                    {/* Image Section */}
                    <div
                        className="w-1/3 relative h-full cursor-pointer group"
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    >
                        {/* Prev Button Hint */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors">
                            <ChevronLeft size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                        </div>
                        <img
                            src={event.image || event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                        />

                        {/* SINGLE Badge - Only show Flash if it's flash, otherwise nothing */}
                        {event.isFlash && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm border border-yellow-200 flex items-center gap-1">
                                <Zap size={8} fill="black" /> FLASH
                            </div>
                        )}

                        {/* Live Pulse - subtle activity indicator */}
                        {!event.isFlash && (
                            <div className="absolute bottom-2 left-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section - SIMPLIFIED */}
                    <div className="w-2/3 p-4 flex flex-col justify-between relative bg-white">
                        {/* Next Button */}
                        <div
                            onClick={(e) => { e.stopPropagation(); onNext(); }}
                            className="absolute right-0 top-0 bottom-0 w-12 flex items-center justify-center cursor-pointer hover:bg-black/5 active:bg-black/10 transition-colors z-10"
                        >
                            <ChevronRight size={24} className="text-muted" />
                        </div>

                        <div className="pr-10">
                            {/* Title - Primary */}
                            <h3 className="font-excep font-black text-text text-lg leading-tight line-clamp-2 mb-2">
                                {event.title}
                            </h3>

                            {/* Time - Secondary */}
                            <div className="flex items-center gap-1 text-xs text-brand-600 font-bold mb-1">
                                <Clock size={12} />
                                <span>{timeLabel}</span>
                            </div>

                            {/* Location - Tertiary */}
                            <div className="flex items-center gap-1 text-xs text-muted font-medium">
                                <MapPin size={12} />
                                <span className="truncate">
                                    {event.location?.name || event.location || 'Cerca de ti'}
                                    {distance && <span className="ml-1">· {distance}</span>}
                                </span>
                            </div>
                        </div>

                        {/* Footer - Single CTA */}
                        <div className="flex items-center justify-between mt-2">
                            {/* Neutral Activity Signal - No exact numbers */}
                            <span className="text-[10px] text-muted font-medium">
                                {event.attendees > 0 ? 'Actividad ahora' : ''}
                            </span>

                            {/* CTA: "Ir" for now, "Me interesa" for future */}
                            <button className="bg-gradient-to-r from-brand-600 to-brand-400 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-500/20 active:scale-95 transition-transform">
                                {isNow ? 'Ir' : 'Me interesa'}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
