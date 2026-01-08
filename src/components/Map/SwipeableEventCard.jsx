import { motion, useMotionValue, useTransform } from 'motion/react';
import { MapPin, Clock, ChevronRight, ChevronLeft, Bookmark, Share2 } from 'lucide-react';

export const SwipeableEventCard = ({ event, distance, onNext, onPrev, onClick }) => {
    const x = useMotionValue(0);
    const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
    const rotate = useTransform(x, [-100, 0, 100], [-3, 0, 3]);

    const handleDragEnd = (e, { offset }) => {
        const swipeThreshold = 50;
        if (offset.x > swipeThreshold) {
            onPrev();
        } else if (offset.x < -swipeThreshold) {
            onNext();
        }
    };

    if (!event) return null;

    // Status badge logic
    const isNow = !event.rawStartTime || new Date(event.rawStartTime) <= new Date();
    const statusLabel = isNow ? 'En curso' : 'Próximamente';
    const statusColor = isNow ? 'blue' : 'orange';

    return (
        <div className="absolute bottom-28 left-0 right-0 px-4 z-20 flex justify-center">
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
                className="w-full bg-white rounded-3xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-gray-100 cursor-grab active:cursor-grabbing"
            >
                <div className="flex flex-col gap-4">
                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            {/* Status Badge */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`flex size-2 rounded-full bg-${statusColor}-500 animate-pulse`}></span>
                                <span className={`text-${statusColor}-600 text-[10px] font-bold uppercase tracking-wider bg-${statusColor}-50 px-2 py-0.5 rounded-md`}>
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
        </div>
    );
};
