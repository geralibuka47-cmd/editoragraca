import { BookOpen, Heart, Award, Users, TrendingUp, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { ViewState } from '../types';
import { getSiteContent } from '../services/dataService';
import { useState, useEffect } from 'react';

interface AboutPageProps {
    onNavigate: (view: ViewState) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const [siteContent, setSiteContent] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);

    const iconMap: Record<string, any> = {
        'BookOpen': BookOpen,
        'Heart': Heart,
        'Award': Award,
        'Users': Users,
        'TrendingUp': TrendingUp
    };

    useEffect(() => {
        const loadContent = async () => {
            setIsLoading(true);
            try {
                const content = await getSiteContent('about');
                setSiteContent(content);
            } catch (error) {
                console.error("Error loading about content:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadContent();
    }, []);

    const values = siteContent['about.values'] || [
        {
            icon: 'BookOpen',
            title: 'Excelência Literária',
            description: 'Compromisso inabalável com a qualidade e rigor editorial em cada publicação.'
        },
        {
            icon: 'Heart',
            title: 'Paixão pela Cultura',
            description: 'Promover e preservar a riqueza cultural angolana através da literatura.'
        },
        {
            icon: 'Users',
            title: 'Valorização de Autores',
            description: 'Apoio integral a escritores locais, dando voz às suas histórias únicas.'
        },
        {
            icon: 'Award',
            title: 'Reconhecimento',
            description: 'Busca constante pela excelência reconhecida nacional e internacionalmente.'
        }
    ];

    const stats = siteContent['about.stats'] || [
        { number: '26+', label: 'Obras Publicadas' },
        { number: '100%', label: 'Autores Angolanos' },
        { number: '5+', label: 'Anos de Actividade' },
        { number: '18', label: 'Províncias Alcançadas' }
    ];

    const timeline = siteContent['about.timeline'] || [
        {
            year: '2020',
            title: 'Fundação',
            description: 'Fundada pelo designer literário Nilton Graça, com o propósito de fortalecer o setor editorial e promover a literautra lusófona.'
        },
        {
            year: '2021',
            title: 'Início Editorial',
            description: 'Início das operações de edição, diagramação e design, servindo autores independentes e parceiros.'
        },
        {
            year: '2023',
            title: 'Crescimento',
            description: 'Marca de 26+ obras publicadas sob selo próprio e através de colaborações institucionais.'
        },
        {
            year: '2026',
            title: 'Reestruturação',
            description: 'Reorganização estratégica, consolidação da comunidade e expansão para formatos digitais.'
        }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Hero Section */}
            <section className="relative bg-brand-dark text-white py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_var(--tw-gradient-stops))] from-brand-primary/20 via-transparent to-transparent"></div>

                <div className="container mx-auto px-4 md:px-8 relative z-10 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 text-[10px] md:text-sm text-brand-primary uppercase tracking-widest font-bold mb-6">
                        <button onClick={() => onNavigate('HOME')} className="hover:underline">Início</button>
                        <span>/</span>
                        <span>Sobre Nós</span>
                    </div>

                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">
                            Onde Cada Página <br />
                            <span className="text-brand-primary italic font-serif font-normal">Conta uma História</span>
                        </h1>
                        <p className="text-lg md:text-2xl text-gray-300 leading-relaxed font-medium">
                            A Editora Graça (SU), LDA é uma casa dedicada à publicação de obras literárias de excelência em Angola.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                        <div className="space-y-4 md:space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Missão</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tighter">
                                Democratizar o Acesso à Cultura
                            </h2>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Democratizar o acesso à cultura através da publicação de obras literárias de qualidade,
                                promovendo autores angolanos e contribuindo para o desenvolvimento intelectual.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full">
                                <TrendingUp className="w-5 h-5 text-brand-primary" />
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Propósito</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tighter">
                                Fortalecer o Setor Editorial
                            </h2>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                A Editora Graça participa ativamente na dinamização cultural, valorizando a produção literária
                                no espaço lusófono como instrumento de preservação da memória e transformação social.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full">
                                <BookOpen className="w-5 h-5 text-brand-primary" />
                                <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Atuação</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tighter">
                                Serviços Completos
                            </h2>
                            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                Prestamos serviços de edição, diagramação, design e acompanhamento editorial, pautados pelo rigor
                                técnico, qualidade estética e respeito à identidade de cada obra e autor.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 md:py-24 bg-brand-light">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 rounded-full mb-6">
                            <Award className="w-5 h-5 text-brand-primary" />
                            <span className="text-brand-primary font-bold tracking-widest uppercase text-xs">Valores</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter mb-4 md:mb-6">
                            Pilares que nos <span className="text-brand-primary italic font-serif font-normal">Definem</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-600">
                            Princípios fundamentais que orientam cada decisão e publicação da Editora Graça.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {values.map((value: any, index: number) => (
                            <div
                                key={index}
                                className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-primary group-hover:scale-110 transition-all duration-300">
                                    {(() => {
                                        const Icon = iconMap[value.icon] || BookOpen;
                                        return <Icon className="w-6 h-6 md:w-8 md:h-8 text-brand-primary group-hover:text-white transition-colors" />;
                                    })()}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-brand-dark mb-3">{value.title}</h3>
                                <p className="text-sm md:text-gray-600 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-brand-dark tracking-tighter mb-4 md:mb-6">
                            Nossa <span className="text-brand-primary italic font-serif font-normal">Trajetória</span>
                        </h2>
                        <p className="text-base md:text-lg text-gray-600">
                            Uma jornada de dedicação à literatura e cultura angolana.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-brand-primary/20 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-12">
                            {timeline.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Year badge */}
                                    <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 bg-brand-primary rounded-full flex items-center justify-center font-black text-lg md:text-2xl text-white shadow-lg md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                                        {item.year}
                                    </div>

                                    {/* Content card */}
                                    <div className={`flex-1 bg-gray-50 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all w-full ${index % 2 === 0 ? 'md:text-right md:mr-auto md:pr-16' : 'md:ml-auto md:pl-16'}`}>
                                        <h3 className="text-xl md:text-2xl font-bold text-brand-dark mb-3">{item.title}</h3>
                                        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 md:py-24 bg-brand-dark text-white">
                <div className="container mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat: any, index: number) => (
                            <div key={index} className="text-center group">
                                <div className="text-3xl md:text-6xl font-black text-brand-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                                    {stat.number}
                                </div>
                                <div className="text-[10px] md:text-base uppercase tracking-widest text-gray-400 font-bold px-2">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Localização</h3>
                                <p className="text-sm md:text-base text-gray-600 group-hover:text-white/90">
                                    Malanje, Bairro Voanvala<br />
                                    Rua 5, Casa n.º 77, Angola
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Phone className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Telefone</h3>
                                <p className="text-sm md:text-base text-gray-600 group-hover:text-white/90">
                                    +244 973 038 386<br />
                                    Seg-Sex: 08:00-18:00
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl text-center group hover:bg-brand-primary hover:text-white transition-all duration-300">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-brand-primary group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-brand-primary" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 group-hover:text-white">Email</h3>
                                <p className="text-sm md:text-base text-gray-600 group-hover:text-white/90 break-words">
                                    geraleditoragraca@gmail.com
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
