import { motion } from 'motion/react';

const SplashScreen = ({ onComplete }) => {
    return (
        <div className="relative w-full h-[100dvh] bg-white overflow-hidden text-gray-900 flex flex-col items-center justify-end pb-[calc(24px+env(safe-area-inset-bottom))]">
            {/* Dynamic Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/park.png"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40"></div>
            </div>

            {/* Content using park.png to fit Eco/City vibe */}
            <div className="z-10 w-full px-6 flex flex-col items-center text-center relative h-full pb-safe-bottom justify-end">

                {/* Obfuscated Events (Hidden on small mobile to save space) */}
                <div className="hidden sm:flex flex-col items-center gap-2 pt-8 mb-auto w-full opacity-60 scale-75 origin-top">
                    {/* Simplified Cards for visual balance */}
                    <div className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-full shadow-sm">
                        <span className="text-lg">☕</span>
                        <div className="h-2 w-24 bg-gray-200 rounded-full"></div>
                    </div>
                </div>

                {/* Flexible Spacer for Mobile */}
                <div className="flex-1 sm:hidden"></div>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-4"
                >
                    <div className="relative w-20 h-20 md:w-32 md:h-32">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <img
                            src="/logo_full.png"
                            alt="UrbanMoop Logo"
                            className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                {/* Headline */}
                <h1
                    className="text-4xl md:text-6xl font-black mb-4 leading-[0.95] tracking-tighter w-full max-w-sm mx-auto text-gray-900"
                >
                    Lo que pasa <br /><span className="text-indigo-600 text-5xl md:text-7xl block mt-1">HOY</span> <span className="block mt-1">a tu alrededor.</span>
                </h1>

                {/* Subtitle */}
                <p
                    className="text-gray-500 text-sm md:text-base mb-2 px-4 font-medium leading-relaxed max-w-xs mx-auto"
                >
                    Descubre cafés nuevos, planes inesperados y secretos del barrio sin perder tiempo.
                </p>
                <p className="text-indigo-600 font-bold text-sm mb-6 max-w-xs mx-auto">
                    Moops = pequeñas quedadas reales cerca de ti.
                </p>

                {/* Value Prop Badge */}
                <div
                    className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-2 px-5 mb-6 rounded-2xl shadow-lg shadow-emerald-500/10 text-sm"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sin anuncios. 100% real.
                </div>

                {/* CTA Button */}
                <button
                    onClick={onComplete}
                    className="w-full max-w-xs bg-gray-900 text-white font-black py-4 rounded-2xl text-lg shadow-xl shadow-gray-900/10 transition-all flex items-center justify-center gap-3 hover:bg-gray-800 active:scale-95 mb-4"
                >
                    Empezar <span className="text-xl">👉</span>
                </button>

                <p className="text-[10px] text-gray-600 mb-8 font-medium">Sin registro. Entra directo.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
