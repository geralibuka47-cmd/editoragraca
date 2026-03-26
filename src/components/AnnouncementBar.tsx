import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnnouncementBarProps {
    onVisibilityChange: (visible: boolean) => void;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onVisibilityChange }) => {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const dismissed = sessionStorage.getItem('announcementDismissed');
        if (!dismissed) {
            setVisible(true);
            onVisibilityChange(true);
        }
    }, []);

    const handleDismiss = () => {
        sessionStorage.setItem('announcementDismissed', '1');
        setVisible(false);
        onVisibilityChange(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-center gap-3 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white"
            style={{
                background: 'linear-gradient(90deg, #0F172A 0%, #B78628 40%, #E5C185 60%, #B78628 80%, #0F172A 100%)',
                backgroundSize: '200% 100%',
                animation: 'announcementShimmer 4s linear infinite',
            }}
            role="banner"
            aria-label="Anúncio de lançamento"
        >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 animate-pulse" />
            <span className="text-center leading-snug">
                🎉 Editora Graça está oficialmente online!&nbsp;
                <button
                    onClick={() => navigate('/livros')}
                    className="underline underline-offset-2 hover:text-amber-200 transition-colors font-black"
                >
                    Explore o catálogo
                </button>
            </span>
            <button
                onClick={handleDismiss}
                className="ml-2 shrink-0 p-0.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fechar anúncio"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            <style>{`
                @keyframes announcementShimmer {
                    0%   { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
            `}</style>
        </div>
    );
};

export default AnnouncementBar;
