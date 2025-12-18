import { X, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, trigger, onGuestContinue }) => { // Added onGuestContinue prop support if passed
    const { signInWithGoogle, signInWithEmail } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [message, setMessage] = useState(''); // For feedback

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            await signInWithGoogle();
            // Redirect happens automatically
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signInWithEmail(email);
            setMessage('¡Enlace mágico enviado! Revisa tu correo.');
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            setMessage('Error al enviar el correo.');
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 6000,
            display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
            <div className="bg-white p-6 rounded-2xl w-[90%] max-w-[350px] text-center shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-text">
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-black text-brand-700 mb-2">Únete a UrbanMoop</h2>
                <p className="text-muted mb-6 text-sm">Para {trigger || 'continuar'}, inicia sesión.</p>

                <div className="flex flex-col gap-3">
                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full bg-white text-text font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 border border-border shadow-sm"
                    >
                        {loading ? 'Cargando...' : <>
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            Continuar con Google
                        </>}
                    </button>

                    {/* Email Toggle */}
                    {!showEmailInput ? (
                        <button
                            onClick={() => setShowEmailInput(true)}
                            className="w-full bg-surface text-text font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-2 transition-colors border border-border"
                        >
                            <Mail size={18} className="text-muted" /> Continuar con Email
                        </button>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text focus:outline-none focus:border-brand-500"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-brand-600 to-brand-300 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/30 hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? 'Enviando...' : 'Enviar Link Mágico'}
                            </button>
                            {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
                        </form>
                    )}

                    {onGuestContinue ? (
                        <button onClick={onGuestContinue} className="mt-4 text-muted text-sm font-medium hover:text-text transition-colors">
                            Continuar como invitado
                        </button>
                    ) : (
                        <button onClick={() => onLoginSuccess && onLoginSuccess('guest')} className="mt-4 text-muted text-sm font-medium hover:text-text transition-colors">
                            Continuar como invitado
                        </button>
                    )}

                </div>
            </div>
        </div>
    );
};
