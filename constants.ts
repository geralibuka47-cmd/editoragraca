
import { Book, PodcastEpisode, BlogPost } from './types';

export const CATEGORIES = [
  "Todos",
  "Ficção Literária",
  "História e Biografia",
  "Infantil",
  "Poesia",
  "Desenvolvimento Pessoal"
];

export const TEAM_MEMBERS = [
  {
    id: "1",
    name: "António Graça",
    role: "Director Geral & Editor-Chefe",
    department: "Liderança",
    bio: "Visionário literário com mais de 20 anos de experiência no mercado angolano, focado na descentralização da cultura.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: "2",
    name: "Maria Luísa",
    role: "Directora Editorial",
    department: "Editorial",
    bio: "Especialista em filologia e apaixonada pela descoberta de novos talentos nas províncias do interior.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: "3",
    name: "Carlos Benguela",
    role: "Designer de Capas",
    department: "Design & Produção",
    bio: "Transforma conceitos abstractos em artes visuais que capturam a essência da alma angolana.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400&h=500"
  },
  {
    id: "4",
    name: "Helena Santos",
    role: "Gestora de Comunicação",
    department: "Marketing",
    bio: "A voz que leva as nossas obras ao coração de cada leitor através das plataformas digitais.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=500"
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "A Revolução do Livro em Malanje",
    content: "Malanje tem se tornado um polo vibrante de novos escritores. A Editora Graça orgulha-se de liderar este movimento...",
    imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80",
    date: "12 Set 2024",
    author: "António Graça"
  },
  {
    id: "2",
    title: "Poesia: O Grito da Nossa Terra",
    content: "A poesia angolana contemporânea reflecte os dilemas e as esperanças de uma nova geração que não tem medo de sonhar...",
    imageUrl: "https://images.unsplash.com/photo-1512428559083-a401a3dd6d45?auto=format&fit=crop&q=80",
    date: "05 Out 2024",
    author: "Maria Luísa"
  },
  {
    id: "3",
    title: "A Importância da Revisão Profissional",
    content: "Muitos autores subestimam o papel do editor. Neste artigo, explicamos como a revisão técnica eleva a qualidade da obra...",
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80",
    date: "20 Out 2024",
    author: "Carlos Benguela"
  }
];

export const PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "1",
    title: "Conversas sobre o Mayombe",
    description: "Uma análise profunda sobre a obra de Pepetela e sua relevância hoje.",
    date: "15 Mai 2024",
    duration: "45:20",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "2",
    title: "Novos Talentos de Malanje",
    description: "Entrevista exclusiva com os vencedores do prémio literário local.",
    date: "02 Jun 2024",
    duration: "38:15",
    audioUrl: "#",
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=600"
  }
];

export const BOOKS: Book[] = [
  {
    id: "1",
    title: "O Vendedor de Passados",
    author: "José Eduardo Agualusa",
    price: 4500,
    category: "Ficção Literária",
    isbn: "978-972-21-1721-0",
    coverUrl: "https://picsum.photos/seed/agualusa/300/450",
    isBestseller: true,
    description: "Uma sátira brilhante sobre a construção da memória e identidade na Angola pós-guerra."
  },
  {
    id: "2",
    title: "Terra Sonâmbula",
    author: "Mia Couto",
    price: 5200,
    category: "Ficção Literária",
    isbn: "978-972-21-0210-0",
    coverUrl: "https://picsum.photos/seed/miacouto/300/450",
    isBestseller: true,
    description: "Um clássico moderno que entrelaça a dura realidade da guerra com o realismo mágico."
  },
  {
    id: "3",
    title: "A Geração da Utopia",
    author: "Pepetela",
    price: 3800,
    category: "História e Biografia",
    isbn: "978-972-21-1000-0",
    coverUrl: "https://picsum.photos/seed/pepetela/300/450",
    isNew: true,
    description: "Uma reflexão profunda sobre os sonhos e desilusões da geração que lutou pela independência."
  },
  {
    id: "4",
    title: "Bom Dia Camaradas",
    author: "Ondjaki",
    price: 3200,
    category: "Ficção Literária",
    isbn: "978-972-21-0500-0",
    coverUrl: "https://picsum.photos/seed/ondjaki/300/450",
    description: "A vida em Luanda vista através dos olhos de uma criança, com humor e ternura."
  },
  {
    id: "5",
    title: "Mayombe",
    author: "Pepetela",
    price: 4000,
    category: "História e Biografia",
    isbn: "978-972-21-0100-0",
    coverUrl: "https://picsum.photos/seed/mayombe/300/450",
    description: "Uma narrativa crua sobre a guerrilha e as complexidades tribais e ideológicas."
  },
  {
    id: "6",
    title: "Sagrada Esperança",
    author: "Agostinho Neto",
    price: 3500,
    category: "Poesia",
    isbn: "978-972-21-0001-0",
    coverUrl: "https://picsum.photos/seed/neto/300/450",
    isBestseller: true,
    description: "Coletânea de poemas que se tornaram hinos da resistência e da esperança angolana."
  },
  {
    id: "7",
    title: "Lueji",
    author: "Pepetela",
    price: 4100,
    category: "História e Biografia",
    isbn: "978-972-21-0002-0",
    coverUrl: "https://picsum.photos/seed/lueji/300/450",
    isNew: true,
    description: "O nascimento do império Lunda contado através de uma narrativa fascinante."
  }
];
