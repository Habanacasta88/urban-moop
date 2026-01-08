import { motion } from 'motion/react';
import { Clock, MapPin, Zap, Calendar, ArrowRight, Ticket } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

// -----------------------------------------------------------------------------
// 1. STANDARD CARD (Music, Moops, etc.) - Dark Theme
// -----------------------------------------------------------------------------
export const LiveCard = ({ item, onClick }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="group relative flex flex-col rounded-xl shadow-lg bg-white dark:bg-[#182b34] overflow-hidden cursor-pointer transition-transform duration-300"
        >
            {/* Image Section */}
            <div className="relative w-full aspect-[4/3] bg-gray-800">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image || item.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182b34] via-transparent to-transparent opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {item.category || 'Moop'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-5 pt-3 bg-white dark:bg-[#182b34]">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                    {item.title}
                </h3>

                <div className="flex items-center gap-4 text-[#90b7cb] text-sm font-medium mt-1">
                    {/* Time */}
                    <div className="flex items-center gap-1.5">
                        <Clock size={16} className="text-[#0da6f2]" />
                        <span>{item.time || 'Ahora'}</span>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#0da6f2]" />
                        <span>{item.distance || '300m'} • {item.place || item.location || 'Centro'}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

// -----------------------------------------------------------------------------
// 2. FLASH CARD - Premium Actionable Style
// -----------------------------------------------------------------------------
export const FlashCard = ({ item, onClick }) => {
    return (
        <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="relative flex flex-col rounded-xl shadow-lg shadow-[#0da6f2]/10 bg-white dark:bg-[#182b34] overflow-hidden ring-1 ring-[#0da6f2]/30 cursor-pointer"
        >
            {/* Image with Flash Overlay */}
            <div className="relative w-full aspect-video bg-gray-800">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image || item.imageUrl})` }}
                />
                {/* Flash Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0da6f2]/40 to-transparent mix-blend-overlay" />

                {/* Flash Badge */}
                <div className="absolute top-4 left-4 bg-[#0da6f2] text-white px-3 py-1 rounded-full shadow-lg shadow-[#0da6f2]/20 flex items-center gap-1">
                    <Zap size={14} fill="currentColor" />
                    <span className="text-xs font-bold uppercase tracking-wider">Flash Event</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 p-5 bg-white dark:bg-[#182b34]">
                <div>
                    <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                        {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1 line-clamp-2">
                        {item.description || 'Oferta por tiempo limitado'}
                    </p>
                </div>

                <div className="flex items-end justify-between mt-1">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[#90b7cb] text-sm font-medium">
                            Termina en {item.timeLeft || item.expiresIn || '58m'}
                        </p>
                        <p className="text-slate-500 text-xs">
                            {item.distance || '0.5km'} • {item.place || 'Bar La Terraza'}
                        </p>
                    </div>
                    <button className="rounded-full h-10 px-5 bg-[#0da6f2] text-white text-sm font-bold shadow-lg shadow-[#0da6f2]/30 hover:bg-sky-400 transition-colors flex items-center gap-2">
                        <span>Ir ya</span>
                        <Ticket size={16} />
                    </button>
                </div>
            </div>
        </motion.article>
    );
};

// -----------------------------------------------------------------------------
// 3. EVENT CARD (Culture/Art) - Dark Theme
// -----------------------------------------------------------------------------
export const EventCard = ({ item, onClick }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="group relative flex flex-col rounded-xl shadow-lg bg-white dark:bg-[#182b34] overflow-hidden cursor-pointer transition-transform duration-300"
        >
            {/* Image */}
            <div className="relative w-full aspect-[16/10] bg-gray-800">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image || item.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182b34] via-transparent to-transparent opacity-60" />

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {item.category || 'Cultura'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-5 pt-3 bg-white dark:bg-[#182b34]">
                <h3 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
                    {item.title}
                </h3>

                <div className="flex items-center gap-4 text-[#90b7cb] text-sm font-medium mt-1">
                    {/* Date */}
                    <div className="flex items-center gap-1.5">
                        <Calendar size={16} className="text-[#0da6f2]" />
                        <span>{item.day ? `${item.day} ${item.month}` : 'Esta semana'}</span>
                    </div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-[#0da6f2]" />
                        <span>{item.distance || '2.5km'} • {item.location || item.place || 'Centro'}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

// -----------------------------------------------------------------------------
// 4. ROUTE CARD - Dark Premium Style
// -----------------------------------------------------------------------------
export const RouteCard = ({ item, onClick }) => {
    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onClick(item)}
            className="group relative flex flex-col rounded-xl shadow-lg bg-[#182b34] overflow-hidden cursor-pointer"
        >
            {/* Image */}
            <div className="relative w-full aspect-[16/9] bg-gray-800">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-60 grayscale transition-all duration-500 group-hover:opacity-70 group-hover:grayscale-0"
                    style={{ backgroundImage: `url(${item.image || item.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#182b34] via-black/40 to-transparent" />

                {/* Route Badge */}
                <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 rounded-full shadow-md">
                    <span className="text-xs font-bold uppercase tracking-wider">🗺️ Ruta</span>
                </div>

                {/* Stops Badge */}
                <div className="absolute top-4 right-4 bg-[#0da6f2]/20 text-[#0da6f2] border border-[#0da6f2]/30 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold">{item.stops || 4} paradas</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-5 pt-3">
                <h3 className="text-white text-xl font-bold leading-tight tracking-tight border-l-4 border-[#0da6f2] pl-3">
                    {item.title}
                </h3>

                <div className="flex items-center gap-4 text-[#90b7cb] text-sm font-medium mt-1 pl-4">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-[#0da6f2]" />
                        <span>{item.duration || '2h 30min'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#0da6f2]" />
                        <span>{item.distance || '3.2 km'}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};
