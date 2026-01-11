
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: 'center' | 'left';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'center' }) => (
  <div className={`mb-12 md:mb-20 space-y-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <span className="text-accent-gold font-bold uppercase tracking-[0.4em] text-[10px] block">{subtitle}</span>
    <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-900 leading-tight">{title}</h2>
  </div>
);

export default SectionHeader;
