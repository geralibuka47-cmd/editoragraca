import React, { useState } from 'react';
import { Users, X } from 'lucide-react';
import { ViewState } from '../types';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    department: string;
    bio: string;
    photoUrl: string;
}

interface TeamPageProps {
    onNavigate: (view: ViewState) => void;
}

const TeamPage: React.FC<TeamPageProps> = ({ onNavigate }) => {
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

    const teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'Geral Ibuka',
            role: 'Director-Geral',
            department: 'Administração',
            bio: 'Com mais de 15 anos de experiência no setor editorial, Geral lidera a visão estratégica da Editora Graça, garantindo excelência em cada publicação e promovendo a cultura angolana através da literatura.',
            photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
        },
        {
            id: '2',
            name: 'Maria Santos',
            role: 'Editora-Chefe',
            department: 'Editorial',
            bio: 'Responsável pela curadoria e revisão editorial de todas as obras publicadas. Maria tem olho afiado para boas histórias e compromisso inabalável com a qualidade literária.',
            photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
        },
        {
            id: '3',
            name: 'João Ferreira',
            role: 'Designer Gráfico',
            department: 'Design',
            bio: 'Especialista em design de capas e diagramação, João transforma manuscritos em obras visualmente deslumbrantes que capturam a essência de cada história.',
            photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
        },
        {
            id: '4',
            name: 'Ana Costa',
            role: 'Gestora de Marketing',
            department: 'Marketing',
            bio: 'Ana desenvolve estratégias inovadoras para promover autores e alcançar novos leitores, conectando histórias com o público certo através de campanhas criativas.',
            photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
        },
        {
            id: '5',
            name: 'Carlos Mendes',
            role: 'Revisor',
            department: 'Editorial',
            bio: 'Com atenção meticulosa aos detalhes, Carlos assegura que cada obra publicada atenda aos mais altos padrões de correção linguística e coerência textual.',
            photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
        },
        {
            id: '6',
            name: 'Sofia Almeida',
            role: 'Gestora de Produção',
            department: 'Produção',
            bio: 'Sofia coordena todo o processo de impressão e distribuição, garantindo que os livros chegam aos leitores com qualidade e pontualidade.',
            photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop'
        }
    ];

    const departments = ['Todos', ...Array.from(new Set(teamMembers.map(m => m.department)))];
    const [selectedDepartment, setSelectedDepartment] = useState('Todos');

    const filteredMembers = selectedDepartment === 'Todos'
        ? teamMembers
        : teamMembers.filter(m => m.department === selectedDepartment);

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
                            Conheça Nossa <span className="text-brand-primary italic font-serif font-normal">Equipa</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                            Profissionais apaixonados pela literatura e dedicados a transformar
                            manuscritos em obras de excelência.
                        </p>
                    </div>
                </div>
            </section>

            {/* Department Filter */}
            <section className="py-8 md:py-12 bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setSelectedDepartment(dept)}
                                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-[10px] md:text-sm uppercase tracking-wider transition-all ${selectedDepartment === dept
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 text-brand-dark hover:bg-gray-200'
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
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-2xl md:rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                onClick={() => setSelectedMember(member)}
                            >
                                <div className="aspect-square overflow-hidden bg-gray-200">
                                    <img
                                        src={member.photoUrl}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 md:p-6">
                                    <h3 className="text-xl md:text-2xl font-black text-brand-dark mb-1">{member.name}</h3>
                                    <p className="text-brand-primary font-bold mb-2 text-sm md:text-base">{member.role}</p>
                                    <p className="text-[11px] md:text-sm text-gray-600 mb-4">{member.department}</p>
                                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{member.bio}</p>
                                    <button className="mt-4 text-brand-primary font-bold text-sm hover:underline">
                                        Ler mais →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedMember && (
                <div
                    className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm"
                    onClick={() => setSelectedMember(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative">
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="absolute top-4 right-4 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all z-20 shadow-lg text-brand-dark"
                                title="Fechar"
                                aria-label="Fechar modal"
                            >
                                <X className="w-5 h-5 md:w-6 md:h-6" />
                            </button>

                            <div className="aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-200">
                                <img
                                    src={selectedMember.photoUrl}
                                    alt={selectedMember.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-6 md:p-12">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-primary/10 rounded-full mb-4 md:mb-6">
                                    <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-brand-primary" />
                                    <span className="text-brand-primary font-bold text-[10px] md:text-xs uppercase tracking-wider">
                                        {selectedMember.department}
                                    </span>
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-brand-dark mb-2 tracking-tighter">{selectedMember.name}</h2>
                                <p className="text-lg md:text-2xl text-brand-primary font-serif font-bold italic mb-6 md:mb-8">{selectedMember.role}</p>
                                <p className="text-gray-600 leading-relaxed text-sm md:text-xl font-medium">{selectedMember.bio}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CTA */}
            <section className="py-24 bg-brand-dark text-white">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Junte-se à Nossa Equipa
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Estamos sempre à procura de talentos apaixonados pela literatura.
                    </p>
                    <button
                        onClick={() => onNavigate('CONTACT')}
                        className="px-12 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-white hover:text-brand-dark transition-all text-lg uppercase tracking-wider shadow-xl"
                    >
                        Enviar Candidatura
                    </button>
                </div>
            </section>
        </div>
    );
};

export default TeamPage;
