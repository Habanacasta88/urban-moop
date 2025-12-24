import { Globe, MapPin, Clock, Bookmark, Navigation } from 'lucide-react';

export const ResultCard = ({ item, type = 'internal', onView, onSave, onNavigate }) => {
    const isExternal = type === 'external' || item.is_external;

    // Handle navigation to Google Maps
    const handleNavigate = () => {
        if (item.lat && item.lng) {
            const url = `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`;
            window.open(url, '_blank');
        } else if (item.location || item.location_name) {
            const location = encodeURIComponent(item.location || item.location_name);
            const url = `https://www.google.com/maps/search/?api=1&query=${location}`;
            window.open(url, '_blank');
        }

        if (onNavigate) onNavigate(item);
    };

    return (
        <div className={`mb-3 rounded-2xl border overflow-hidden transition-all ${isExternal
                ? 'bg-blue-50/50 border-blue-200 hover:border-blue-300'
                : 'bg-white border-border hover:border-brand-200'
            }`}>
            <div className="flex gap-3 p-3">
                {/* Image */}
                <div className="w-20 h-20 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            {isExternal ? '🌐' : '📍'}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-bold text-text leading-tight line-clamp-1">
                            {item.title}
                        </h4>
                        {isExternal && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                <Globe size={10} /> Web
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted line-clamp-2 mb-2">
                        {item.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 mb-2">
                        {/* Hours */}
                        {item.hours && (
                            <span className="text-[10px] text-green-600 flex items-center gap-1">
                                <Clock size={10} /> {item.hours}
                            </span>
                        )}

                        {/* Match Score */}
                        {item.similarity && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.similarity > 0.7
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-brand-50 text-brand-700 border-brand-100'
                                }`}>
                                {(item.similarity * 100).toFixed(0)}% Match
                            </span>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            className="text-xs px-3 py-1.5 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
                            onClick={() => onView && onView(item)}
                        >
                            Ver
                        </button>
                        <button
                            className="text-xs px-3 py-1.5 bg-surface border border-border rounded-lg font-medium hover:bg-surface-2 transition-colors flex items-center gap-1"
                            onClick={() => onSave && onSave(item)}
                        >
                            <Bookmark size={12} /> Guardar
                        </button>
                        <button
                            className="text-xs px-3 py-1.5 bg-surface border border-border rounded-lg font-medium hover:bg-surface-2 transition-colors flex items-center gap-1"
                            onClick={handleNavigate}
                        >
                            <Navigation size={12} /> Ir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
