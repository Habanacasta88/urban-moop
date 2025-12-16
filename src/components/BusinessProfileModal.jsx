
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export const BusinessProfileModal = ({ isOpen, onClose, publication, categoryColor, onOpenMessage }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-black overflow-y-auto"
            style={{ background: '#111' }}
        >
            <div className="relative">
                {/* Header Image */}
                <div className="h-48 relative">
                    <ImageWithFallback src={publication.imageUrl} className="w-full h-full object-cover opacity-50" />
                    <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-black/50 rounded-full text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="px-5 -mt-10 relative">
                    <div className="flex justify-between items-end">
                        <div className="w-24 h-24 rounded-full border-4 border-black overflow-hidden relative bg-gray-800">
                            <ImageWithFallback src={publication.creator.avatar} className="w-full h-full object-cover" />
                        </div>
                        <button
                            onClick={onOpenMessage}
                            className="mb-4 px-6 py-2 rounded-full font-bold text-white text-sm"
                            style={{ background: categoryColor }}
                        >
                            Contactar
                        </button>
                    </div>

                    <h2 className="text-2xl font-bold text-white mt-4">{publication.creator.name}</h2>
                    <p className="text-gray-400 text-sm mt-1">Ubicación: {publication.location.name}</p>

                    <div className="mt-6">
                        <h3 className="text-white font-bold mb-3">Sobre nosotros</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </div>

                    <div className="mt-8 mb-20">
                        <h3 className="text-white font-bold mb-3">Próximos eventos</h3>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <p className="text-white text-sm font-semibold">{publication.title}</p>
                            <p className="text-gray-400 text-xs mt-1">{publication.date}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
