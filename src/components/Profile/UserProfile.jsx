import { useState, useEffect } from 'react';
import { User, Settings, Edit2, MapPin, ChevronRight, Shield, Globe, Coffee, Beer, Music, BookOpen, DollarSign, Utensils, Activity, Users as UsersIcon, Camera, LayoutGrid, Tag, Newspaper, Map, Calendar, Navigation, MessageCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Profile.css';

const Toggle = ({ active, onToggle }) => (
    <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-gray-600'}`}
    >
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
);

const UserProfile = ({ onRequestLogin, onOpenChats }) => {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        full_name: '',
        avatar_url: '',
        neighborhood: 'Seleccionar barrio',
        bio: '',
        vibes: []
    });

    // Local State for UI interactions
    const [ageRange, setAgeRange] = useState('26-30');
    const [contentPrefs, setContentPrefs] = useState({
        newPlaces: true,
        offers: true,
        news: false,
        routes: true,
        dailyPlans: true
    });
    const [preciseLocation, setPreciseLocation] = useState(true);

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

                if (error && error.code !== 'PGRST116') {
                    throw error;
                }

                if (data) {
                    setProfile({
                        full_name: data.full_name || user.user_metadata.full_name || 'Usuario',
                        avatar_url: data.avatar_url || user.user_metadata.avatar_url || 'https://via.placeholder.com/150',
                        neighborhood: data.neighborhood || 'Sin barrio',
                        bio: data.bio || '',
                        vibes: data.vibes || []
                    });
                } else {
                    // Profile doesn't exist, use Auth Metadata
                    setProfile({
                        full_name: user.user_metadata.full_name || 'Usuario Nuevo',
                        avatar_url: user.user_metadata.avatar_url,
                        neighborhood: 'Sin barrio',
                        bio: '',
                        vibes: []
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
                bio: profile.bio,
                vibes: profile.vibes,
                updated_at: new Date(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            console.log('Profile saved!');
        } catch (error) {
            console.error('Error updating profile:', error.message);
        } finally {
            setSaving(false);
        }
    };

    // Interests Helpers (Visual only for now, could link to 'vibes' in DB later)
    const toggleInterest = (id) => {
        // Logic to update local state or db vibes
    };

    const interestOptions = [
        { id: 'cafes', label: 'Cafés', icon: <Coffee size={14} /> },
        { id: 'bars', label: 'Bares', icon: <Beer size={14} /> },
        { id: 'nightlife', label: 'Nightlife', icon: <Music size={14} /> },
        { id: 'culture', label: 'Cultura', icon: <BookOpen size={14} /> },
    ];

    if (!user) {
        return (
            <div className="w-full h-full bg-bg flex flex-col items-center justify-center p-8">
                <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 text-muted border border-border">
                    <User size={48} />
                </div>
                <h2 className="text-2xl font-bold text-brand-700 mb-2 text-center">Perfil de Invitado</h2>
                <p className="text-muted text-center mb-8 max-w-xs font-medium">
                    Inicia sesión para guardar tus sitios favoritos, unirte a Moops y personalizar tu perfil.
                </p>
                <button
                    onClick={onRequestLogin}
                    className="w-full max-w-xs bg-brand-600 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-brand-700 transition shadow-lg shadow-brand-500/30"
                >
                    Iniciar Sesión / Registrarse
                </button>
            </div>
        );
    }

    if (loading) {
        return <div className="p-10 text-center text-muted mt-20 font-medium">Cargando perfil...</div>;
    }

    return (
        <div className="w-full h-full bg-bg pb-24 overflow-y-auto hide-scrollbar">
            {/* 1. Información Básica */}
            <div className="p-6 flex flex-col items-center border-b border-border bg-bg/50 backdrop-blur-sm">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 p-1 mb-4 shadow-xl shadow-brand-500/20">
                    <div className="w-full h-full rounded-full bg-white border-[3px] border-white overflow-hidden">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-300"><User size={40} /></div>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-black text-brand-700 mb-1 tracking-tight">{profile.full_name}</h2>
                <div className="flex items-center gap-1 text-muted mb-6 font-medium text-sm">
                    <MapPin size={14} /> {profile.neighborhood}
                </div>

                <div className="flex gap-3 w-full max-w-xs">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-black text-white font-bold py-2.5 rounded-full flex items-center justify-center gap-2 text-sm hover:bg-gray-800 transition shadow-lg disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : <><Edit2 size={16} /> Guardar Cambios</>}
                    </button>
                    <button onClick={onOpenChats} className="w-12 h-12 flex items-center justify-center bg-white text-brand-600 rounded-full border border-border hover:bg-brand-50 transition shadow-md">
                        <MessageCircle size={20} />
                    </button>
                    <button onClick={signOut} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-full border border-red-200 hover:bg-red-100 transition shadow-sm">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* STATS ROW (Recovered) */}
                <div className="flex w-full justify-between items-center mt-6 px-4 bg-surface rounded-2xl py-4 border border-border shadow-sm">
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-brand-700">42</span>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Moops</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-yellow-500">850</span>
                        <span className="text-[10px] text-yellow-600/80 font-bold uppercase tracking-wider">Karma</span>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-col items-center">
                        <span className="text-xl font-black text-brand-700">128</span>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Amigos</span>
                    </div>
                </div>
            </div>

            {/* 2. Mi Experiencia UrbanMoop */}
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                        <Globe size={18} />
                    </div>
                    <h3 className="text-lg font-bold text-text">Mi Experiencia UrbanMoop</h3>
                </div>

                {/* Barrio */}
                <div className="mb-8">
                    <label className="text-xs font-bold text-muted uppercase tracking-wider mb-3 block ml-1">Mi Barrio Actual</label>
                    <button className="w-full bg-surface p-4 rounded-xl flex items-center justify-between hover:bg-surface-2 transition group border border-border">
                        <span className="text-text font-bold flex items-center gap-2">
                            <MapPin size={18} className="text-brand-500" /> {profile.neighborhood}
                        </span>
                        <ChevronRight size={18} className="text-muted group-hover:text-brand-500" />
                    </button>
                </div>

                {/* Intereses (Visual Only) */}
                {/* RANGO DE EDAD */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Rango de Edad</label>
                        <button className="text-xs font-bold text-brand-600">Editar</button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {['18-25', '26-30', '31-35', '36-45', '45+'].map(bg => (
                            <button
                                key={bg}
                                onClick={() => setAgeRange(bg)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${ageRange === bg
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20'
                                    : 'bg-surface text-muted border-border hover:bg-surface-2'
                                    }`}
                            >
                                {bg}
                            </button>
                        ))}
                    </div>
                </div>

                {/* INTERESES URBANOS */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Intereses Urbanos</label>
                        <button className="text-xs font-bold text-brand-600">Editar</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { id: 'coffee', icon: '☕', label: 'Cafés' },
                            { id: 'beer', icon: '🍺', label: 'Bares' },
                            { id: 'night', icon: '🌙', label: 'Nightlife' },
                            { id: 'art', icon: '🎨', label: 'Cultura' },
                            { id: 'cheap', icon: '💸', label: 'Low Cost' },
                            { id: 'food', icon: '🍽', label: 'Gastro' },
                            { id: 'sport', icon: '⚽', label: 'Deportes' },
                            { id: 'fam', icon: '👨‍👩‍👧', label: 'Familiar' },
                            { id: 'aes', icon: '📸', label: 'Aesthetic' },
                        ].map(item => (
                            <button
                                key={item.id}
                                className="bg-surface rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-surface-2 transition-colors border border-border hover:border-brand-200 group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                <span className="text-[10px] font-bold text-muted uppercase tracking-wide group-hover:text-brand-600">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* CONTENIDO PREFERIDO */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3 px-1">
                        <label className="text-xs font-bold text-muted uppercase tracking-wider">Contenido Preferido</label>
                        <button className="text-xs font-bold text-brand-600">Editar</button>
                    </div>
                    <div className="space-y-2">
                        {[
                            { id: 'newPlaces', icon: '✨', label: 'Sitios nuevos' },
                            { id: 'offers', icon: '🏷️', label: 'Ofertas' },
                            { id: 'news', icon: '📰', label: 'Noticias hiperlocales' },
                            { id: 'routes', icon: '🗺️', label: 'Rutas Moop' },
                            { id: 'dailyPlans', icon: '📅', label: 'Planes del día' },
                        ].map(pref => (
                            <div key={pref.id} className="flex items-center justify-between bg-surface p-3 rounded-xl border border-border hover:bg-surface-2 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{pref.icon}</span>
                                    <span className="text-sm font-bold text-text-2">{pref.label}</span>
                                </div>
                                <Toggle
                                    active={contentPrefs[pref.id]}
                                    onToggle={() => setContentPrefs({ ...contentPrefs, [pref.id]: !contentPrefs[pref.id] })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* UBICACIÓN PRECISA */}
                <div className="bg-brand-50/50 p-4 rounded-2xl border border-brand-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Map className="text-brand-500" size={18} />
                            <span className="text-sm font-bold text-brand-900">Ubicación precisa</span>
                        </div>
                        <Toggle active={preciseLocation} onToggle={() => setPreciseLocation(!preciseLocation)} />
                    </div>
                    <p className="text-[10px] text-brand-700/60 leading-relaxed font-medium">
                        Se activa solo cuando abres el mapa para eventos cercanos. <span className="text-emerald-600 flex items-center gap-1 inline-flex mt-1"><Shield size={10} /> Privacidad protegida</span>
                    </p>
                </div>
            </div>

            {/* 3. MENU GRID (Recovered) */}
            <div className="p-4 grid grid-cols-4 gap-2 border-b border-border">
                {[
                    { icon: Calendar, label: 'Eventos', color: 'text-blue-600 bg-blue-50' },
                    { icon: Activity, label: 'Actividad', color: 'text-purple-600 bg-purple-50' },
                    { icon: Newspaper, label: 'Noticias', color: 'text-pink-600 bg-pink-50' },
                    { icon: Settings, label: 'Ajustes', color: 'text-gray-600 bg-gray-100' }
                ].map((item, i) => (
                    <button key={i} className="aspect-square rounded-2xl bg-surface flex flex-col items-center justify-center gap-2 hover:bg-surface-2 transition active:scale-95 border border-border">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.color}`}>
                            <item.icon size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-text-2">{item.label}</span>
                    </button>
                ))}
            </div>

            {/* 5. Manifesto */}
            <div className="p-6">
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-4 block ml-1 flex items-center gap-2">
                    <Edit2 size={12} /> Mi Manifiesto
                </label>
                <div className="relative">
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        placeholder="Escribe algo sobre ti..."
                        className="w-full bg-surface text-text p-4 rounded-2xl border border-border focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none text-sm leading-relaxed min-h-[120px] resize-none italic font-medium placeholder:text-muted"
                    />
                    <div className="absolute bottom-4 right-4 text-[10px] text-brand-600 bg-brand-50 px-2 py-1 rounded border border-brand-100 font-bold">
                        Visible en tu perfil
                    </div>
                </div>
            </div>

            <div className="p-6 pt-2">
                <button
                    onClick={() => window.open('https://wa.me/34600000000', '_blank')}
                    className="w-full bg-[#25D366] text-white p-4 rounded-xl flex items-center justify-center gap-3 font-bold shadow-lg hover:bg-[#128C7E] transition-colors active:scale-95 transform"
                >
                    <MessageCircle size={24} fill="currentColor" className="text-white" />
                    <span>Contactar con Soporte</span>
                </button>
                <p className="text-center text-muted text-xs mt-6 mb-2 font-medium">
                    UrbanMoop - Connected
                </p>
            </div>
            <div className="h-6"></div>
        </div>
    );
};

export default UserProfile;
