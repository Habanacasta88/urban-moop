import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Flame, Map, BarChart2, Users } from 'lucide-react';
import { useFlare } from '../../context/FlareContext';

export default function BottomNav() {
    const { flareState } = useFlare();
    const isFlareActive = flareState !== 'none';

    const navItemClass = ({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''}`;

    return (
        <nav className="bottom-nav">
            <NavLink to="/home" className={navItemClass}>
                <Home size={24} />
                <span>Hoy</span>
            </NavLink>

            <NavLink to="/flare" className={`${navItemClass} ${isFlareActive ? 'flare-active' : ''}`}>
                <Flame size={24} className={isFlareActive ? 'animate-pulse' : ''} />
                <span>Brote</span>
            </NavLink>

            <NavLink to="/map" className={navItemClass}>
                <Map size={24} />
                <span>Mapa</span>
            </NavLink>

            <NavLink to="/insights" className={navItemClass}>
                <BarChart2 size={24} />
                <span>Insights</span>
            </NavLink>

            <NavLink to="/community" className={navItemClass}>
                <Users size={24} />
                <span>Comunidad</span>
            </NavLink>

            <style>{`
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 480px;
          height: 80px;
          background: var(--bg-card);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-top: 1px solid rgba(0,0,0,0.05);
          box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
          z-index: 100;
          padding-bottom: 10px; /* Safe area for iOS */
        }
        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--text-light);
          font-size: 0.7rem;
          gap: 4px;
          width: 100%;
          height: 100%;
          transition: color 0.2s ease;
        }
        .nav-item.active {
          color: var(--color-primary);
        }
        
        .flare-active {
            color: var(--color-accent) !important;
        }
        .animate-pulse {
            animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
            100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </nav>
    );
}
