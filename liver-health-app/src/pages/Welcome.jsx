import { useNavigate } from 'react-router-dom';
import { ChevronRight, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full justify-between py-12">
            <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-100 text-brand-600 rounded-3xl mb-4 shadow-sm">
                    <Activity className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Hígado Sano <br />
                    <span className="text-brand-600">en 12 Semanas</span>
                </h1>
                <p className="text-lg text-slate-500 max-w-xs mx-auto leading-relaxed">
                    El programa basado en ciencia para revertir el hígado graso y recuperar tu energía.
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    fullWidth
                    size="lg"
                    onClick={() => navigate('/onboarding')}
                    className="shadow-brand-300 shadow-lg"
                >
                    <span className="flex-1 text-center">Empezar mi plan</span>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                </Button>

                <button className="w-full text-sm font-medium text-slate-400 hover:text-brand-600 transition-colors py-2">
                    Ya tengo una cuenta
                </button>
            </div>
        </div>
    );
}
