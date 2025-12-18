import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import SplashScreen from './SplashScreen';
import NeighborhoodSelection from './NeighborhoodSelection';
import VibeSelector from './VibeSelector';
import Permissions from './Permissions';

const OnboardingFlow = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({});
    const [flowType, setFlowType] = useState('unknown'); // 'gps' or 'manual'

    // STEP 0 -> 2: Splash to Neighborhood (Skip Permissions)
    const handleSplashComplete = () => {
        setUserData(prev => ({ ...prev, locationGranted: false }));
        setFlowType('manual');
        setStep(2);
    };

    // STEP 1 -> 2 or 3: Permissions (Unused but kept for reference)
    const handlePermissionsNext = (locationGranted) => {
        if (locationGranted) {
            setUserData(prev => ({ ...prev, locationGranted: true }));
            setFlowType('gps');
            // Skip Neighborhood, go to Vibes
            setStep(3);
        } else {
            setUserData(prev => ({ ...prev, locationGranted: false }));
            setFlowType('manual');
            // Go to Neighborhood Fallback
            setStep(2);
        }
    };

    // STEP 2 -> 3: Neighborhood to Vibes
    const handleNeighborhoodNext = (hood) => {
        setUserData(prev => ({ ...prev, neighborhood: hood }));
        setStep(3);
    };

    // STEP 3 -> 4: Vibes to Loading
    const handleVibeNext = (vibes) => {
        setUserData(prev => ({ ...prev, vibes }));
        setStep(4);
    };

    // STEP 4: Finish
    const finishOnboarding = () => {
        localStorage.setItem('urbanmoop_user', JSON.stringify(userData));
        onComplete(userData);
    };

    const handleBack = () => {
        if (step === 2) {
            setStep(0); // Back to splash from Neighborhood
        } else if (step === 3 && flowType === 'gps') {
            setStep(0); // Back to splash if using old flow (though mostly manual now)
        } else if (step > 0) {
            setStep(step - 1);
        }
    };

    // Determine Loading Text
    let loadingTextType = 'default';
    if (flowType === 'gps') loadingTextType = 'gps';
    if (userData.neighborhood) loadingTextType = 'hood';

    return (
        <div className="w-full h-full bg-white text-gray-900">
            {step === 0 && <SplashScreen onComplete={handleSplashComplete} />}

            {/* Step 1: Permissions (Promoted) */}
            {step === 1 && (
                <Permissions
                    onNext={handlePermissionsNext}
                    onBack={() => setStep(0)}
                />
            )}

            {/* Step 2: Neighborhood (Fallback) */}
            {step === 2 && (
                <NeighborhoodSelection
                    onNext={handleNeighborhoodNext}
                    onBack={handleBack}
                />
            )}

            {/* Step 3: Vibes */}
            {step === 3 && (
                <VibeSelector
                    data={userData}
                    onNext={handleVibeNext}
                    onBack={handleBack}
                />
            )}

            {/* Step 4: Loading */}
            {step === 4 && (
                <LoadingFinishScreen
                    onComplete={finishOnboarding}
                    textType={loadingTextType}
                    neighborhood={userData.neighborhood}
                />
            )}
        </div>
    );
};

const LoadingFinishScreen = ({ onComplete, textType, neighborhood }) => {
    const [textIndex, setTextIndex] = useState(0);

    // Dynamic Messages
    const getMessages = () => {
        return [
            "Encontrando planes…",
            "Detectando moops activos…",
            "Cargando vibra del barrio…",
            "¡Todo listo! 🚀"
        ];
    };

    const messages = getMessages();

    useEffect(() => {
        const textInterval = setInterval(() => setTextIndex(prev => (prev + 1) % messages.length), 1200);
        const finishTimeout = setTimeout(onComplete, 4500); // Debug: Faster animation
        return () => {
            clearInterval(textInterval);
            clearTimeout(finishTimeout);
        };
    }, []);

    // Mock "Matches" for the social map
    const socialMatches = [
        { id: 1, img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', icon: '🍸', pos: 'top-10 right-10', delay: 0.5 }, // Bar/Party
        { id: 2, img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100', icon: '🎨', pos: 'bottom-20 left-8', delay: 1.2 }, // Art
        { id: 3, img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100', icon: '⚡', pos: 'top-32 left-10', delay: 2.0 },
        { id: 4, img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100', icon: '💃', pos: 'bottom-40 right-12', delay: 2.8 },
    ];

    return (
        <div className="sub-page flex flex-col h-full px-6 pb-24 text-center animate-in fade-in duration-500 bg-white relative overflow-hidden">

            {/* Background Grid/Map Effect */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative z-10">

                {/* Central Radar Pulse */}
                <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
                    {/* Ripple 1 */}
                    <div className="absolute w-full h-full border border-[#5B4B8A]/10 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    {/* Ripple 2 */}
                    <div className="absolute w-2/3 h-2/3 border border-[#5B4B8A]/20 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }} />

                    {/* Center User */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="relative z-20 w-20 h-20 bg-gradient-to-tr from-[#5B4B8A] to-indigo-400 rounded-full p-1 shadow-xl shadow-indigo-200"
                    >
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden">
                            <img src="/logo_full.png" alt="UrbanMoop" className="w-full h-full object-contain p-2" />
                        </div>
                        {/* Status Dot */}
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 border-4 border-white rounded-full"></div>
                    </motion.div>

                    {/* Floating Social Matches */}
                    {socialMatches.map((match) => (
                        <motion.div
                            key={match.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: match.delay, type: 'spring', stiffness: 200 }}
                            className={`absolute ${match.pos}`}
                        >
                            <div className="relative">
                                {/* Connector Line (Visual Hack using rotation) */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: 60 }}
                                    transition={{ delay: match.delay + 0.2, duration: 0.5 }}
                                    className="absolute top-1/2 left-1/2 -z-10 h-[1px] bg-gradient-to-r from-transparent to-[#5B4B8A]/30 origin-left"
                                    style={{ transform: 'translate(-50%, -50%) rotate(45deg)' }} // Simplified rotation
                                />

                                {/* Avatar */}
                                <img src={match.img} className="w-12 h-12 rounded-full border-2 border-white shadow-lg object-cover" alt="" />

                                {/* Sticker Icon */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -20 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: match.delay + 0.3 }}
                                    className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center text-sm border border-gray-100"
                                >
                                    {match.icon}
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Text Animation */}
                <h1 className="text-2xl font-black text-gray-900 mb-2 min-h-[40px] tracking-tight">
                    {messages[textIndex]}
                </h1>
                <p className="text-gray-500 font-medium px-8">
                    Conectando con tu tribu urbana...
                </p>
            </div>
        </div>
    );
};


export default OnboardingFlow;
