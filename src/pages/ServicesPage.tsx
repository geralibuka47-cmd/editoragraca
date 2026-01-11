import React from 'react';
import { BookOpen, Pencil, Palette, Shield, Megaphone, Printer, Check, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface ServicesPageProps {
    onNavigate: (view: ViewState) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
    const services = [
        {
            icon: Pencil,
            title: 'Revisão e Edição de Texto',
            description: 'Revisão ortográfica, gramatical e editorial completa para garantir qualidade literária.',
            price: 'Desde 15.000 Kz',
            features: [
                'Correção ortográfica e gramatical',
                'Adequação ao acordo ortográfico',
                'Sugestões de melhoria estilística',
                'Revisão de coerência e coesão',
                'Até 2 rondas de revisão'
            ]
        },
        {
            icon: BookOpen,
            title: 'Diagramação Profissional',
            description: 'Layout interno premium que valoriza o conteúdo e melhora a experiência de leitura.',
            price: 'Desde 20.000 Kz',
            features: [
                'Design de páginas interno',
                'Tipografia profissional',
                'Formatação de capítulos',
                'Inclusão de imagens e gráficos',
                'Arquivo pronto para impressão'
            ]
        },
        {
            icon: Palette,
            title: 'Design de Capa',
            description: 'Capas exclusivas e impactantes que destacam sua obra nas prateleiras e online.',
            price: 'Desde 25.000 Kz',
            features: [
                'Design exclusivo e original',
                'Até 3 propostas de capa',
                'Revisões ilimitadas',
                'Capa + lombada + contracapa',
                'Arquivos em alta resolução'
            ]
        },
        {
            icon: Shield,
            title: 'Registos e Legalização',
            description: 'Tratamento completo de ISBN, Depósito Legal e outros registos obrigatórios.',
            price: 'Desde 10.000 Kz',
            features: [
                'Registo de ISBN',
                'Depósito Legal',
                'Registo de Direitos de Autor',
                'Certificados oficiais',
                'Consultoria jurídica'
            ]
        },
        {
            icon: Megaphone,
            title: 'Marketing e Publicidade',
            description: 'Estratégias de divulgação para alcançar seu público-alvo e aumentar vendas.',
            price: 'Desde 30.000 Kz',
            features: [
                'Plano de marketing personalizado',
                'Gestão de redes sociais',
                'Materiais promocionais',
                'Lançamento do livro',
                'Assessoria de imprensa'
            ]
        },
        {
            icon: Printer,
            title: 'Impressão e Distribuição',
            description: 'Impressão de qualidade e distribuição eficiente em todo território angolano.',
            price: 'Sob consulta',
            features: [
                'Impressão offset ou digital',
                'Várias opções de acabamento',
                'Tiragens a partir de 50 unidades',
                'Distribuição nacional',
                'Logística incluída'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero */}
            <section className="bg-brand-dark text-white py-20">
                <div className="container mx-auto px-8">
                    <div className="flex items-center gap-2 text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Serviços</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                            Serviços <span className="text-brand-primary italic font-serif font-normal">Editoriais</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium mb-8">
                            Transformamos manuscritos em obras publicadas com excelência profissional.
                            Oferecemos soluções completas para autores independentes e editoras parceiras.
                        </p>
                        <button
                            onClick={() => onNavigate('CONTACT')}
                            className="btn-premium text-lg"
                        >
                            Solicitar Orçamento
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-24">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                            <BookOpen className="w-5 h-5 text-brand-primary" />
                            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Nossos Serviços</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Soluções <span className="text-brand-primary italic font-serif font-normal">Completas</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Da manuscrito à impressão, cuidamos de cada detalhe da sua publicação.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                                >
                                    <div className="p-8">
                                        <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                                            <Icon className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                                        </div>

                                        <h3 className="text-2xl font-black text-brand-dark mb-3">{service.title}</h3>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                                        <div className="text-2xl font-black text-brand-primary mb-6">{service.price}</div>

                                        <div className="space-y-3 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="px-8 pb-8">
                                        <button
                                            onClick={() => onNavigate('CONTACT')}
                                            className="w-full px-6 py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-all uppercase text-sm tracking-wider"
                                        >
                                            Solicitar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Packages */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Pacotes <span className="text-brand-primary italic font-serif font-normal">Promocionais</span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Economize contratando pacotes completos de serviços.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Basic Package */}
                        <div className="bg-gray-50 rounded-3xl p-8 border-2 border-gray-200">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-black text-brand-dark mb-2">Básico</h3>
                                <div className="text-4xl font-black text-brand-primary mb-2">45.000 Kz</div>
                                <p className="text-sm text-gray-600">Publicação Essencial</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Revisão completa</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Diagramação simples</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">ISBN</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => onNavigate('CONTACT')}
                                className="w-full px-6 py-3 bg-brand-dark text-white rounded-lg font-bold hover:bg-brand-primary transition-all"
                            >
                                Escolher
                            </button>
                        </div>

                        {/* Professional Package */}
                        <div className="bg-brand-primary rounded-3xl p-8 border-2 border-brand-primary shadow-2xl transform scale-105">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-dark text-white text-xs font-bold rounded-full uppercase">
                                Mais Popular
                            </div>
                            <div className="text-center mb-8 text-white">
                                <h3 className="text-2xl font-black mb-2">Profissional</h3>
                                <div className="text-4xl font-black mb-2">80.000 Kz</div>
                                <p className="text-sm text-white/80">Publicação Completa</p>
                            </div>
                            <ul className="space-y-3 mb-8 text-white">
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5" />
                                    <span className="text-sm">Tudo do Básico</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5" />
                                    <span className="text-sm">Design de capa exclusivo</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5" />
                                    <span className="text-sm">Marketing básico</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5" />
                                    <span className="text-sm">50 cópias impressas</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => onNavigate('CONTACT')}
                                className="w-full px-6 py-3 bg-white text-brand-primary rounded-lg font-bold hover:bg-brand-dark hover:text-white transition-all"
                            >
                                Escolher
                            </button>
                        </div>

                        {/* Premium Package */}
                        <div className="bg-brand-dark rounded-3xl p-8 border-2 border-brand-dark text-white">
                            <div className="text-center mb-8">
                                <h3 className="text-2xl font-black mb-2">Premium</h3>
                                <div className="text-4xl font-black text-brand-primary mb-2">150.000 Kz</div>
                                <p className="text-sm text-gray-400">Publicação VIP</p>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Tudo do Profissional</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Marketing avançado</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Evento de lançamento</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">200 cópias impressas</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-brand-primary" />
                                    <span className="text-sm">Distribuição nacional</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => onNavigate('CONTACT')}
                                className="w-full px-6 py-3 bg-brand-primary text-white rounded-lg font-bold hover:bg-white hover:text-brand-dark transition-all"
                            >
                                Escolher
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-brand-primary text-white">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Pronto para Publicar?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Entre em contacto connosco e receba um orçamento personalizado para o seu projeto.
                    </p>
                    <button
                        onClick={() => onNavigate('CONTACT')}
                        className="px-12 py-4 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all text-lg uppercase tracking-wider shadow-xl"
                    >
                        Solicitar Orçamento
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ServicesPage;
