import { motion } from 'motion/react';

const SplashScreen = ({ onComplete }) => {
    return (
        <div className="relative w-full h-screen bg-white overflow-hidden text-gray-900 flex flex-col items-center justify-end pb-12">
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
            <div className="z-10 w-full px-6 flex flex-col items-center text-center relative h-full pb-12">

                {/* Obfuscated Events (Top of Flow - No Overlap) */}
                <div className="flex flex-col items-center gap-4 pt-12 mb-auto w-full">
                    {/* Card 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-full w-auto max-w-[280px] shadow-sm"
                    >
                        <span className="text-xl">☕</span>
                        <div className="flex flex-col items-start gap-1">
                            <div className="h-3 w-32 bg-gray-200 rounded-full"></div>
                            <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
                        </div>
                    </motion.div>

                    {/* Card 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-full w-auto max-w-[300px] shadow-xl shadow-purple-500/10"
                    >
                        <span className="text-xl">✨</span>
                        <div className="flex flex-col items-start gap-1">
                            <div className="h-3 w-40 bg-gray-200 rounded-full"></div>
                        </div>
                    </motion.div>

                    {/* Card 3 */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-full w-auto max-w-[260px] shadow-sm"
                    >
                        <span className="text-xl">🔥</span>
                        <div className="flex flex-col items-start gap-1">
                            <div className="h-3 w-28 bg-gray-200 rounded-full"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded-full"></div>
                        </div>
                    </motion.div>
                </div>

                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <div className="relative w-28 h-28 md:w-36 md:h-36">
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
                    className="text-5xl md:text-6xl font-black mb-6 leading-[0.9] tracking-tighter w-full max-w-sm mx-auto text-gray-900"
                >
                    🔥 Lo que pasa <br /><span className="text-indigo-600 text-6xl md:text-7xl block mt-2">HOY</span> <span className="block mt-2">a tu alrededor.</span>
                </h1>

                {/* Subtitle */}
                <p
                    className="text-gray-500 text-base mb-10 px-4 font-medium leading-relaxed max-w-xs mx-auto"
                >
                    Descubre cafés nuevos, planes inesperados y secretos del barrio sin perder tiempo.
                </p>

                {/* Value Prop Badge */}
                <div
                    className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold py-3 px-6 mb-8 rounded-2xl shadow-lg shadow-emerald-500/10"
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-50 animate-pulse"></span>
                    Sin anuncios. 100% real.
                </div>

                {/* CTA Button */}
                <button
                    onClick={onComplete}
                    className="w-full max-w-xs bg-gray-900 text-white font-black py-5 rounded-2xl text-xl shadow-xl shadow-gray-900/10 transition-all flex items-center justify-center gap-3 hover:bg-gray-800 active:scale-95"
                >
                    Empezar <span className="text-2xl">👉</span>
                </button>

                <p className="text-[10px] text-gray-600 mt-6 font-medium">Sin registro. Entra directo.</p>
            </div>
        </div>
    );
};

export default SplashScreen;
