import React, { useEffect, useRef } from 'react';

// Publisher ID da Editora Graça
const PUBLISHER_ID = 'ca-pub-2844305048621932';

type AdFormat = 'auto' | 'rectangle' | 'horizontal' | 'vertical';

interface AdUnitProps {
    /** Slot ID do anúncio (obtido no painel AdSense em Anúncios > Por bloco de anúncios) */
    slot: string;
    format?: AdFormat;
    /** Se true, o anúncio adapta-se à largura do contentor (responsive) */
    responsive?: boolean;
    className?: string;
    /** Mostra label discreta "Publicidade" acima do anúncio */
    showLabel?: boolean;
}

declare global {
    interface Window {
        adsbygoogle: any[];
    }
}

/**
 * Componente reutilizável para blocos Google AdSense.
 * O script adsbygoogle.js é carregado globalmente no index.html.
 * Em desenvolvimento os anúncios não aparecem — isso é comportamento normal do AdSense.
 */
const AdUnit: React.FC<AdUnitProps> = ({
    slot,
    format = 'auto',
    responsive = true,
    className = '',
    showLabel = true,
}) => {
    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {
            // AdSense não disponível em desenvolvimento — comportamento normal
        }
    }, []);

    return (
        <div className={`flex flex-col items-center w-full overflow-hidden ${className}`}>
            {showLabel && (
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300 mb-1 select-none">
                    Publicidade
                </p>
            )}
            <ins
                className="adsbygoogle block w-full"
                style={{ display: 'block' }}
                data-ad-client={PUBLISHER_ID}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive={responsive ? 'true' : 'false'}
            />
        </div>
    );
};

export default AdUnit;
