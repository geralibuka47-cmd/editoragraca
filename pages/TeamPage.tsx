
import React from 'react';
import SectionHeader from '../components/SectionHeader';
import { TEAM_MEMBERS } from '../constants';

const TeamPage: React.FC = () => {
    return (
        <div className="py-16 md:py-32 animate-fade-in max-w-7xl mx-auto px-4 md:px-6">
            <SectionHeader title="Nossa Equipa" subtitle="Excelência Humana" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {TEAM_MEMBERS.map(member => (
                    <div key={member.id} className="text-center group">
                        <div className="relative overflow-hidden rounded-[2rem] aspect-[4/5] mb-6">
                            <img src={member.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={member.name} loading="lazy" />
                        </div>
                        <h4 className="text-xl md:text-2xl font-serif font-bold text-brand-900">{member.name}</h4>
                        <p className="text-[10px] font-bold text-accent-gold uppercase tracking-[0.2em] mb-4">{member.role}</p>
                        <p className="text-xs text-gray-500 italic px-4 leading-relaxed">{member.bio}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPage;
