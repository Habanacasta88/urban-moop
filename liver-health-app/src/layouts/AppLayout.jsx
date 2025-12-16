import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, LayoutDashboard, Utensils, TrendingUp, HelpCircle } from 'lucide-react';
import { clsx } from 'clsx';

function NavItem({ to, icon: Icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200",
                    isActive ? "text-brand-600 font-medium" : "text-slate-400 hover:text-slate-500"
                )
            }
        >
            <Icon className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px]">{label}</span>
        </NavLink>
    );
}

export default function AppLayout() {
    return (
        <div className="flex flex-col h-screen bg-slate-50 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
                <Outlet />
            </main>

            {/* Bottom Navigation */}
            <nav className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-lg border-t border-slate-100 pb-safe">
                <div className="flex items-center justify-around h-full px-2">
                    <NavItem to="/today" icon={LayoutDashboard} label="Hoy" />
                    <NavItem to="/plan" icon={Calendar} label="Plan" />
                    <NavItem to="/eat" icon={Utensils} label="Comer" />
                    <NavItem to="/progress" icon={TrendingUp} label="Progreso" />
                    <NavItem to="/help" icon={HelpCircle} label="Ayuda" />
                </div>
            </nav>
        </div>
    );
}
