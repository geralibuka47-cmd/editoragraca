import React, { useState } from 'react';
import { motion as m } from 'framer-motion';
import { User as UserIcon, Download, Sparkles, Settings, Save, Loader2 } from 'lucide-react';
import { User } from '../../types';
import { useToast } from '../Toast';
import { saveUserProfile } from '../../services/dataService';

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
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label htmlFor="admin-name" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">IDENTIDADE (NOME)</label>
                            <div className="relative">
                                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                                <input
                                    id="admin-name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-16 pr-8 py-5 bg-black/20 border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-black text-white uppercase tracking-widest"
                                    placeholder="NOME DO ADMINISTRADOR"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="admin-email" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">CREDENCIAL (EMAIL)</label>
                            <div className="relative">
                                <Download className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700 rotate-180" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={formData.email}
                                    className="w-full pl-16 pr-8 py-5 bg-black/20 border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-bold text-gray-500 cursor-not-allowed opacity-60"
                                    readOnly
                                    title="Email não modificável"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="admin-whatsapp" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">COMUNICAÇÃO (WHATSAPP)</label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">+244</span>
                                <input
                                    id="admin-whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full pl-16 pr-8 py-5 bg-black/20 border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-bold text-white tracking-widest"
                                    placeholder="9XX XXX XXX"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="admin-bio" className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">BIO / NOTAS</label>
                            <div className="relative">
                                <textarea
                                    id="admin-bio"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-8 py-5 bg-black/20 border border-white/5 rounded-2xl focus:border-brand-primary/30 outline-none transition-all font-medium text-gray-300 text-sm leading-relaxed"
                                    placeholder="Notas do sistema ou bio..."
                                />
                            </div>
                        </div>
                    </div>

                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-5 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_-10px_rgba(189,147,56,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                ATUALIZANDO...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                GRAVAR ALTERAÇÕES
                            </>
                        )}
                    </m.button>
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
