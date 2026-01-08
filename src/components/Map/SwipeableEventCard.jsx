import { motion, useMotionValue, useTransform } from 'motion/react';
import { MapPin, Clock, Bookmark, Share2 } from 'lucide-react';
import { useRef, useEffect } from 'react';

export const SwipeableEventCard = ({ events, currentIndex, distance, onCardChange, onClick }) => {
    const scrollRef = useRef(null);

    // Scroll to current index when it changes
    useEffect(() => {
        if (scrollRef.current && events?.length > 0) {
            const cardWidth = scrollRef.current.offsetWidth * 0.88; // 88% of container width
            scrollRef.current.scrollTo({
                left: currentIndex * (cardWidth + 16), // 16px gap
                behavior: 'smooth'
            });
        }
    }, [currentIndex, events?.length]);

    // Handle scroll snap end to update current index
    const handleScrollEnd = () => {
        if (scrollRef.current) {
            const cardWidth = scrollRef.current.offsetWidth * 0.88;
            const newIndex = Math.round(scrollRef.current.scrollLeft / (cardWidth + 16));
            if (newIndex !== currentIndex && newIndex >= 0 && newIndex < events?.length) {
                onCardChange(newIndex);
            }
        }
    };

    if (!events || events.length === 0) return null;

    return (
        <div className="absolute bottom-28 left-0 right-0 z-20">
            {/* Horizontal Scroll Container */}
            <div
                ref={scrollRef}
                onScrollEnd={handleScrollEnd}
                onTouchEnd={() => setTimeout(handleScrollEnd, 100)}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide w-full scroll-smooth px-4 pb-4 gap-4"
                style={{ scrollPaddingLeft: '16px' }}
            >
                {events.map((event, index) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        distance={distance}
                        isActive={index === currentIndex}
                        onClick={() => onClick(event)}
                    />
                ))}
            </div>
        </div>
    );
};

// Individual Event Card Component
const EventCard = ({ event, distance, isActive, onClick }) => {
    // Status badge logic
    const isNow = !event.rawStartTime || new Date(event.rawStartTime) <= new Date();
    const statusLabel = isNow ? 'En curso' : 'Próximamente';
    const statusColor = isNow ? 'blue' : 'orange';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: isActive ? 1 : 0.9,
                y: 0,
                scale: isActive ? 1 : 0.98
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={onClick}
            className="min-w-[88%] snap-center cursor-pointer"
        >
            <div className={`bg-white rounded-3xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 flex flex-col gap-4 transition-all duration-300 ${isActive ? '' : 'opacity-90'
                }`}>
                {/* Header Row */}
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`flex size-2 rounded-full ${statusColor === 'blue' ? 'bg-blue-500' : 'bg-orange-500'} animate-pulse`}></span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${statusColor === 'blue'
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-orange-600 bg-orange-50'
                                }`}>
                                {statusLabel}
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-gray-900 text-2xl font-extrabold leading-tight tracking-tight">
                            {event.title}
                        </h2>

                        {/* Location */}
                        <p className="text-gray-500 text-sm mt-1 font-medium">
                            {event.location?.name || event.location || event.place || 'Cerca de ti'}
                        </p>
                    </div>

                    {/* Time Badge */}
                    <div className="bg-gray-100 px-2.5 py-1.5 rounded-lg flex flex-col items-center">
                        <span className="text-xs font-bold text-gray-900">
                            {event.time || '20:00'}
                        </span>
                    </div>
                </div>

                {/* Info Pills */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <MapPin size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">{distance || '200m'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">
                            {event.endsIn || '~ 1h left'}
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="flex-1 h-12 rounded-2xl bg-black text-white font-bold text-sm shadow-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        Ver detalles
                    </button>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="size-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                        <Bookmark size={20} />
                    </button>
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="size-12 rounded-2xl bg-gray-50 text-gray-900 border border-gray-100 hover:bg-gray-100 transition-colors flex items-center justify-center"
                    >
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
