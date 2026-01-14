import React, { useState, useEffect } from 'react';
import { Users, X, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { getTeamMembers, getSiteContent } from '../services/dataService';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl: string;
    order?: number;
}

interface TeamPageProps {
    onNavigate: (view: ViewState) => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDepartment, setSelectedDepartment] = useState('Todos');

    const FALLBACK_MEMBERS: TeamMember[] = [
        {
            id: 'f-1',
            name: 'Geral Ibuka',
            role: 'Director-Geral',
            department: 'Administração',
            bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça, garantindo excelência em cada publicação e promovendo a cultura angolana através da literatura.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
            order: 1
        },
        {
            id: 'f-2',
            name: 'Maria Santos',
            role: 'Editora-Chefe',
            department: 'Editorial',
            bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas. Maria tem olho afiado para boas histórias e compromisso inabalável com a qualidade literária.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
            order: 2
        },
        {
            id: 'f-3',
            name: 'João Ferreira',
            role: 'Designer Gráfico',
            department: 'Design',
            bio: 'Especialista em design de capas e diagramação, João transforma manuscritos em obras visualmente deslumbrantes que capturam a essência de cada história.',
            photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
            order: 3
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [membersData, content] = await Promise.all([
                    getTeamMembers(),
                    getSiteContent('team')
                ]);
                setMembers(membersData.length > 0 ? membersData : FALLBACK_MEMBERS);
                setSiteContent(content);
            } catch (error) {
                console.error("Erro ao carregar dados da equipa:", error);
                setMembers(FALLBACK_MEMBERS);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const departments = ['Todos', ...Array.from(new Set(members.map(m => m.department)))];

    const filteredMembers = selectedDepartment === 'Todos'
        ? members
        : members.filter(m => m.department === selectedDepartment);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
                    <p className="font-serif text-xl font-bold text-brand-dark italic">Reunindo a equipa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Equipa</span>
                    </div>

                    <div className="max-w-4xl text-center md:text-left">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">
                            {siteContent['hero.title'] || "Conheça Nossa"} <span className="text-brand-primary italic font-serif font-normal">{siteContent['hero.subtitle'] || "Equipa"}</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                            {siteContent['hero.description'] || "Profissionais apaixonados pela literatura e dedicados a transformar manuscritos em obras de excelência."}
                        </p>
                    </div>
                </div>
            </section>

            {/* Department Filter */}
            <section className="py-8 md:py-12 bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all border-2 ${selectedDepartment === dept
                                    ? 'bg-brand-primary border-brand-primary text-white shadow-lg'
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-primary hover:text-brand-primary'
                                    }`}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Grid */}
            <section className="py-12 md:py-24">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer border border-gray-100 flex flex-col"
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className="aspect-square overflow-hidden bg-gray-50 relative">
                                    <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                                <div className="p-8 md:p-10 text-center flex-1 flex flex-col">
                                    <div className="mb-6">
                                        <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {member.department}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black text-brand-dark mb-2 tracking-tighter group-hover:text-brand-primary transition-colors">{member.name}</h3>
                                    <p className="text-brand-primary font-serif font-bold italic mb-6 text-lg">{member.role}</p>
                                    <p className="text-gray-600 leading-relaxed line-clamp-3 font-medium mb-8 flex-1">{member.bio}</p>
                                    <div className="mt-auto">
                                        <button className="text-brand-primary font-black text-xs uppercase tracking-widest border-b-2 border-brand-primary pb-1 hover:text-brand-dark hover:border-brand-dark transition-all">
                                            Ver Perfil Completo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-brand-dark/90 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-md"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white rounded-[2.5rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all z-20 shadow-lg text-brand-dark border border-gray-100"
                            title="Fechar"
                            aria-label="Fechar modal"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto overflow-hidden bg-gray-100">
                                <img
                                    src={selectedMember.photoUrl}
                                    alt={selectedMember.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-8 md:p-16 w-full md:w-1/2 flex flex-col justify-center">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 rounded-full mb-8">
                                    <Users className="w-4 h-4 text-brand-primary" />
                                    <span className="text-brand-primary font-black text-[10px] uppercase tracking-widest">
                                        {selectedMember.department}
                                    </span>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4 tracking-tighter leading-none">{selectedMember.name}</h2>
                                <p className="text-xl md:text-2xl text-brand-primary font-serif font-bold italic mb-10">{selectedMember.role}</p>

                                <div className="w-12 h-1 bg-brand-primary/20 mb-10"></div>

                                <p className="text-gray-600 leading-relaxed text-lg md:text-xl font-medium italic">
                                    "{selectedMember.bio}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="container mx-auto px-8 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 max-w-3xl mx-auto leading-tight">
                        {siteContent['cta.title'] || "Quer Fazer Parte da Nossa História?"}
                    </h2>
                    <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                        {siteContent['cta.description'] || "Estamos sempre em busca de mentes criativas e apaixonadas pelo mundo literário angolano."}
                    </p>
                    <button
                        onClick={() => onNavigate('CONTACT')}
                        className="px-12 py-5 bg-white text-brand-primary font-black rounded-2xl hover:bg-brand-dark hover:text-white transition-all text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 duration-300"
                    >
                        Enviar Candidatura
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TeamPage;
