import { useState, useEffect } from 'react';
import { User, MapPin, ChevronRight, Shield, Coffee, Beer, Music, BookOpen, Utensils, Camera, Map, MessageCircle, LogOut, Check, Bell, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Profile.css';

const Toggle = ({ active, onToggle }) => (
    <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-brand-500' : 'bg-gray-300'}`}
    >
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const UserProfile = ({ onRequestLogin }) => {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        full_name: '',
        avatar_url: '',
        neighborhood: 'Seleccionar barrio',
        interests: []
    });

    // Preferences State (Local for MVP, could be DB JSONB)
    const [prefs, setPrefs] = useState({
        // Content
        newPlaces: true,
        routes: true,
        dailyPlans: true,
        // Notifications
        savedReminders: true,
        eventsToday: true,
        moopsNearby: false,
        // Privacy
        preciseLocation: true
    });

    // Interest Options (CORE)
    const INTERESTS = [
        { id: 'culture', icon: <BookOpen size={16} />, label: 'Cultura' },
        { id: 'music', icon: <Music size={16} />, label: 'Música' },
        { id: 'food', icon: <Utensils size={16} />, label: 'Gastro' },
        { id: 'coffee', icon: <Coffee size={16} />, label: 'Cafés' },
        { id: 'night', icon: <Beer size={16} />, label: 'Nightlife' },
        { id: 'family', icon: <User size={16} />, label: 'Familiar' }, // Using User icon as placeholder for Family
        { id: 'sports', icon: <User size={16} />, label: 'Deportes' }, // Placeholder icon
        { id: 'lowcost', icon: <User size={16} />, label: 'Low cost' }, // Placeholder icon
        { id: 'aesthetic', icon: <Camera size={16} />, label: 'Aesthetic' },
    ];

    // Load Profile
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const getProfile = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error && error.code !== 'PGRST116') throw error;

                if (data) {
                    setProfile({
                        full_name: data.full_name || user.user_metadata.full_name || 'Usuario',
                        avatar_url: data.avatar_url || user.user_metadata.avatar_url,
                        neighborhood: data.neighborhood || 'Sin barrio',
                        interests: data.vibes || [] // Using 'vibes' column for interests
                    });
                    // Load preferences if stored, otherwise keep defaults (Mock implementation for prefs)
                } else {
                    setProfile({
                        full_name: user.user_metadata.full_name || 'Nuevo Usuario',
                        avatar_url: user.user_metadata.avatar_url,
                        neighborhood: 'Sin barrio',
                        interests: []
                    });
                }
            } catch (error) {
                console.error('Error loading profile:', error.message);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        try {
            setSaving(true);
            const updates = {
                id: user.id,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                neighborhood: profile.neighborhood,
                vibes: profile.interests, // Saving interests to 'vibes' column
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;

            // Here we would save prefs to a separate column/table if needed

            // Visual feedback
            setTimeout(() => setSaving(false), 800);
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setSaving(false);
        }
    };

    const toggleInterest = (id) => {
        setProfile(prev => {
            const exists = prev.interests.includes(id);
            const newInterests = exists
                ? prev.interests.filter(i => i !== id)
                : [...prev.interests, id];
            return { ...prev, interests: newInterests };
        });
    };

    const togglePref = (key) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!user) {
        return (
            <div className="w-full h-full bg-bg flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 text-muted border border-border">
                    <User size={48} />
                </div>
                <h2 className="text-2xl font-black text-brand-700 mb-2 text-center">Perfil de Invitado</h2>
                <p className="text-muted text-center mb-8 max-w-xs font-medium">
                    Inicia sesión para personalizar tu experiencia UrbanMoop.
                </p>
                <button
                    onClick={onRequestLogin}
                    className="w-full max-w-xs bg-brand-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-700 transition shadow-lg shadow-brand-500/30"
                >
                    Iniciar Sesión
                </button>
            </div>
        );
    }

    if (loading) return <div className="p-10 text-center text-muted mt-20 font-medium">Cargando perfil...</div>;

    return (
        <div className="w-full h-full bg-bg pb-32 overflow-y-auto hide-scrollbar font-sf text-text">

            {/* 1. IDENTIDAD BÁSICA */}
            <div className="p-8 flex flex-col items-center border-b border-border bg-white rounded-b-3xl shadow-sm z-10 relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-400 to-brand-600 p-1 mb-4 shadow-xl shadow-brand-500/20">
                    <div className="w-full h-full rounded-full bg-white border-4 border-white overflow-hidden relative">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400"><User size={48} /></div>
                        )}
                        <button className="absolute bottom-0 right-0 left-0 bg-black/50 text-white py-1 flex justify-center backdrop-blur-sm">
                            <Camera size={12} />
                        </button>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-2xl font-black text-gray-900 leading-tight mb-1">{profile.full_name}</h2>
                    <p className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1">
                        <MapPin size={14} /> {profile.neighborhood}
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-8 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition shadow-lg active:scale-95 disabled:opacity-70"
                >
                    {saving ? 'Guardando...' : <>Guardar Cambios <Check size={16} /></>}
                </button>
            </div>

            <div className="p-6 space-y-8">

                {/* 2. INTERESES URBANOS (CORE) */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-6 h-6 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600">
                            <User size={14} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Intereses Urbanos</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        {INTERESTS.map(item => {
                            const isSelected = profile.interests.includes(item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => toggleInterest(item.id)}
                                    className={`p-3 rounded-2xl flex flex-col items-center gap-2 transition-all border ${isSelected
                                            ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-brand-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`${isSelected ? 'text-white' : 'text-gray-400'}`}>{item.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-tight">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 px-1">
                        Se usan para personalizar tu Smart Radar y Feed.
                    </p>
                </section>

                <hr className="border-gray-100" />

                {/* 3. PREFERENCIAS DE CONTENIDO */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-6 h-6 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <Eye size={14} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Qué quieres ver</h3>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                        {[
                            { id: 'newPlaces', label: '✨ Sitios nuevos', desc: 'Aperturas recientes' },
                            { id: 'routes', label: '🗺️ Rutas Moop', desc: 'Itinerarios curados' },
                            { id: 'dailyPlans', label: '📆 Planes del día', desc: 'Agenda 24h' }
                        ].map((item, idx) => (
                            <div key={item.id} className={`p-4 flex items-center justify-between ${idx !== 2 ? 'border-b border-gray-100' : ''}`}>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{item.label}</p>
                                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                                </div>
                                <Toggle active={prefs[item.id]} onToggle={() => togglePref(item.id)} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. UBICACIÓN */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <MapPin size={14} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Ubicación</h3>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-4 mb-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Tu zona principal</label>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl cursor-pointer hover:bg-gray-100">
                            <span className="font-bold text-sm text-gray-900">{profile.neighborhood}</span>
                            <ChevronRight size={16} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Map size={16} className="text-gray-900" />
                                <span className="font-bold text-sm text-gray-900">Ubicación precisa</span>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px]">
                                Solo se usa cuando abres el mapa para mostrarte lo más cercano.
                            </p>
                        </div>
                        <Toggle active={prefs.preciseLocation} onToggle={() => togglePref('preciseLocation')} />
                    </div>
                </section>

                {/* 5. NOTIFICACIONES */}
                <section>
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-6 h-6 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600">
                            <Bell size={14} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Notificaciones</h3>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                        {[
                            { id: 'savedReminders', label: 'Recordatorios', desc: '1h antes de tus planes' },
                            { id: 'eventsToday', label: 'Eventos hoy', desc: 'Resumen matutino' },
                            { id: 'moopsNearby', label: 'Moops cercanos', desc: 'Avisos en tiempo real' }
                        ].map((item, idx) => (
                            <div key={item.id} className={`p-4 flex items-center justify-between ${idx !== 2 ? 'border-b border-gray-100' : ''}`}>
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{item.label}</p>
                                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                                </div>
                                <Toggle active={prefs[item.id]} onToggle={() => togglePref(item.id)} />
                            </div>
                        ))}
                    </div>
                </section>

                <hr className="border-gray-100" />

                {/* 6. PRIVACIDAD & SOPORTE */}
                <section className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-3">
                        <Shield size={18} className="text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-xs font-bold text-gray-700 mb-1">Privacidad de datos</p>
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                Usamos tu actividad de forma anónima para mejorar las recomendaciones del barrio. No compartimos tus datos con terceros.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => window.open('https://wa.me/34600000000', '_blank')}
                        className="w-full bg-white border border-gray-200 text-gray-700 p-4 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-gray-50 transition-colors active:scale-95"
                    >
                        <MessageCircle size={18} />
                        Contactar con Soporte
                    </button>

                    <button
                        onClick={signOut}
                        className="w-full text-red-500 font-bold text-xs py-4 hover:bg-red-50 rounded-xl transition-colors"
                    >
                        Cerrar Sesión
                    </button>

                    <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest pt-4">
                        UrbanMoop MVP v1.0
                    </p>
                </section>

            </div>
        </div>
    );
};

export default UserProfile;
