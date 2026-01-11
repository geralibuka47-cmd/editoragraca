import React from 'react';
import { BookOpen, Heart, Award, Users, TrendingUp, MapPin, Mail, Phone } from 'lucide-react';
import { ViewState } from '../types';

interface AboutPageProps {
    onNavigate: (view: ViewState) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const values = [
        {
            icon: BookOpen,
            title: 'Excelência Literária',
            description: 'Compromisso inabalável com a qualidade e rigor editorial em cada publicação.'
        },
        {
            icon: Heart,
            title: 'Paixão pela Cultura',
            description: 'Promover e preservar a riqueza cultural angolana através da literatura.'
        },
        {
            icon: Users,
            title: 'Valorização de Autores',
            description: 'Apoio integral a escritores locais, dando voz às suas histórias únicas.'
        },
        {
            icon: Award,
            title: 'Reconhecimento',
            description: 'Busca constante pela excelência reconhecida nacional e internacionalmente.'
        }
    ];

    const stats = [
        { number: '500+', label: 'Livros Publicados' },
        { number: '150+', label: 'Autores Angolanos' },
        { number: '10k+', label: 'Leitores Satisfeitos' },
        { number: '15', label: 'Anos de Experiência' }
    ];

    const timeline = [
        {
            year: '2010',
            title: 'Fundação',
            description: 'Nascimento da Editora Graça em Malanje, com a missão de descentralizar o acesso à cultura.'
        },
        {
            year: '2015',
            title: 'Expansão',
            description: 'Abertura de novos canais de distribuição e parcerias com autores de todo o país.'
        },
        {
            year: '2020',
            title: 'Modernização',
            description: 'Investimento em tecnologia e plataformas digitais para alcançar mais leitores.'
        },
        {
            year: '2026',
            title: 'Liderança',
            description: 'Consolidação como uma das principais editoras de Angola, com projecção internacional.'
        }
    ];

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero Section */}
            <section className="relative bg-brand-dark text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent"></div>

                <div className="container mx-auto px-8 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Sobre Nós</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8">
                            Onde Cada Página <br />
                            <span className="text-brand-primary italic font-serif font-normal">Conta uma História</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-medium">
                            A Editora Graça (SU), LDA é uma casa dedicada à publicação de obras literárias
                            de excelência em Angola, fomentando a cultura e o conhecimento através das letras.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Missão</span>
                            </div>
                            <h2 className="text-4xl font-black text-brand-dark tracking-tighter">
                                Democratizar o Acesso à Cultura
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Democratizar o acesso à cultura através da publicação de obras literárias de qualidade,
                                promovendo autores angolanos e contribuindo para o desenvolvimento intelectual e cultural
                                da nossa sociedade.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Acreditamos que a literatura tem o poder de transformar vidas, inspirar mudanças e conectar
                                pessoas através de histórias autênticas e significativas.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full">
                                <BookOpen className="w-5 h-5 text-brand-primary" />
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Visão</span>
                            </div>
                            <h2 className="text-4xl font-black text-brand-dark tracking-tighter">
                                Referência em Excelência Editorial
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Ser a editora de referência em Angola e nos países lusófonos, reconhecida pela excelência
                                editorial, inovação e compromisso com a cultura angolana.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Aspiramos expandir o alcance da literatura angolana para o mundo, criando pontes culturais
                                e dando visibilidade internacional aos nossos autores.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-brand-light">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                            <Award className="w-5 h-5 text-brand-primary" />
                            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Valores</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Pilares que nos <span className="text-brand-primary italic font-serif font-normal">Definem</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Princípios fundamentais que orientam cada decisão e publicação da Editora Graça.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="w-16 h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                                        <Icon className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold text-brand-dark mb-3">{value.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                            Nossa <span className="text-brand-primary italic font-serif font-normal">Trajetória</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Uma jornada de dedicação à literatura e cultura angolana.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-primary/20 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-12">
                            {timeline.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                        }`}
                                >
                                    {/* Year badge */}
                                    <div className="flex-shrink-0 w-24 h-24 bg-brand-primary rounded-full flex items-center justify-center font-black text-2xl text-white shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                                        {item.year}
                                    </div>

                                    {/* Content card */}
                                    <div className={`flex-1 bg-gray-50 p-8 rounded-2xl shadow-md hover:shadow-lg transition-all ${index % 2 === 0 ? 'md:text-right md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'
                                        }`}>
                                        <h3 className="text-2xl font-bold text-brand-dark mb-3">{item.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-24 bg-brand-dark text-white">
                <div className="container mx-auto px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-4xl md:text-6xl font-black text-brand-primary mb-3 group-hover:scale-110 transition-transform">
                                    {stat.number}
                                </div>
                                <div className="text-sm md:text-base uppercase tracking-widest text-gray-400 font-bold">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-brand-dark tracking-tighter mb-6">
                                Onde nos <span className="text-brand-primary italic font-serif font-normal">Encontrar</span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                Estamos em Malanje, prontos para atender autores e leitores.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-16 h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-8 h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Localização</h3>
                                <p className="text-gray-600 group-hover:text-white/90">
                                    Malanje, Bairro Voanvala<br />
                                    Rua 5, Casa n.º 77<br />
                                    Angola
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-16 h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Phone className="w-8 h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Telefone</h3>
                                <p className="text-gray-600 group-hover:text-white/90">
                                    +244 973 038 386<br />
                                    +244 947 472 230<br />
                                    Seg-Sex: 08:00-18:00
                                </p>
                            </div>

                            <div className="bg-gray-50 p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-16 h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Email</h3>
                                <p className="text-gray-600 group-hover:text-white/90 break-words">
                                    geraleditoragraca<br />@gmail.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-brand-primary text-white">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                        Tem uma História para Contar?
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        A Editora Graça está sempre à procura de novos talentos e histórias autênticas.
                        Entre em contacto connosco.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('CONTACT')}
                            className="px-10 py-4 bg-white text-brand-primary font-bold rounded-lg hover:bg-brand-dark hover:text-white transition-all text-sm uppercase tracking-wider shadow-xl"
                        >
                            Contactar-nos
                        </button>
                        <button
                            onClick={() => onNavigate('SERVICES')}
                            className="px-10 py-4 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-brand-primary transition-all text-sm uppercase tracking-wider"
                        >
                            Ver Serviços
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
