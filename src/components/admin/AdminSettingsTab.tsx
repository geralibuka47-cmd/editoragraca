import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { User as UserIcon, Download, Sparkles, Settings, Save, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { useToast } from '../Toast';
import { saveUserProfile } from '../../services/dataService';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';

interface AdminSettingsTabProps {
    user: User;
    onUpdate?: () => void;
}

const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ user, onUpdate }) => {
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        whatsapp: user.whatsappNumber || '',
        bio: user.bio || ''
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveUserProfile({
                ...user,
                name: formData.name,
                whatsappNumber: formData.whatsapp,
                bio: formData.bio
            });
            showToast('Perfil de administrador atualizado!', 'success');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            showToast('Erro ao atualizar perfil.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none mb-4">
                        Configurações do <span className="text-brand-primary">Sistema</span>
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Credenciais e Protocolos de Acesso</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-white/[0.02] rounded-[3rem] border border-white/5 p-12 space-y-10 shadow-xl">
                    <div className="space-y-8">
                        <Input
                            label="IDENTIDADE (NOME)"
                            variant="glass"
                            icon={<UserIcon className="w-4 h-4" />}
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="NOME DO ADMINISTRADOR"
                        />

                        <Input
                            label="CREDENCIAL (EMAIL)"
                            variant="glass"
                            icon={<Download className="w-4 h-4 rotate-180" />}
                            value={formData.email}
                            readOnly
                            title="Email não modificável"
                            className="cursor-not-allowed opacity-60"
                        />

                        <Input
                            label="COMUNICAÇÃO (WHATSAPP)"
                            variant="glass"
                            icon={<span className="text-gray-500 font-bold text-[10px]">+244</span>}
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            placeholder="9XX XXX XXX"
                        />

                        <Textarea
                            label="BIO / NOTAS"
                            variant="glass"
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Notas do sistema ou bio..."
                        />
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        isLoading={isSaving}
                        className="w-full py-6 rounded-2xl"
                        leftIcon={!isSaving && <Save className="w-4 h-4" />}
                    >
                        {isSaving ? 'ATUALIZANDO...' : 'GRAVAR ALTERAÇÕES'}
                    </Button>
                </div>

                <div className="space-y-8">
                    <div className="bg-brand-primary/5 rounded-[3rem] border border-brand-primary/10 p-12 flex flex-col items-center justify-center text-center space-y-8 h-full">
                        <div className="w-32 h-32 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20 relative">
                            <Sparkles className="w-12 h-12 text-brand-primary animate-pulse" />
                            <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full" />
                        </div>
                        <div>
                            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Acesso <span className="text-brand-primary">GOD MODE</span></h4>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 max-w-sm mx-auto leading-relaxed">
                                Você possui privilégios totais de administração. Todas as alterações efetuadas aqui refletem-se imediatamente nos protocolos de segurança.
                            </p>
                        </div>
                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                            <p className="text-[9px] font-mono text-brand-primary">ID: {user.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsTab;
