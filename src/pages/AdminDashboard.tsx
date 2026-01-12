import React, { useState, useEffect } from 'react';
import { BookOpen, Users, ShoppingCart, Plus, Edit, Trash2, User as UserIcon, CheckCircle, FileText, XCircle, Download, X, Upload, Image, File, Layout, Calendar } from 'lucide-react';
import { ViewState, User } from '../types';

interface AdminDashboardProps {
    user: User | null;
    onNavigate: (view: ViewState) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
    const [activeTab, setActiveTab] = useState<'stats' | 'books' | 'users' | 'manuscripts' | 'orders' | 'blog' | 'team' | 'services'>('stats');
    const [stats, setStats] = useState({
        totalBooks: 0,
        totalUsers: 0,
        pendingOrders: 0,
        revenue: 0
    });
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    const [books, setBooks] = useState<import('../types').Book[]>([]);
    const [isLoadingBooks, setIsLoadingBooks] = useState(true);

    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const [manuscripts, setManuscripts] = useState<import('../types').Manuscript[]>([]);
    const [isLoadingManuscripts, setIsLoadingManuscripts] = useState(true);
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [editorialServices, setEditorialServices] = useState<any[]>([]);
    const [isLoadingBlog, setIsLoadingBlog] = useState(true);
    const [isLoadingTeam, setIsLoadingTeam] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    // Modal state for additional entities
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [blogForm, setBlogForm] = useState<any>({ title: '', content: '', imageUrl: '', author: '', date: new Date().toISOString().split('T')[0] });
    const [isSavingBlog, setIsSavingBlog] = useState(false);

    const [showTeamModal, setShowTeamModal] = useState(false);
    const [teamForm, setTeamForm] = useState<any>({ name: '', role: '', department: '', bio: '', photoUrl: '', order: 0 });
    const [isSavingTeam, setIsSavingTeam] = useState(false);

    const [showServiceModal, setShowServiceModal] = useState(false);
    const [serviceForm, setServiceForm] = useState<any>({ title: '', price: '', details: [], order: 0 });
    const [isSavingService, setIsSavingService] = useState(false);
    const [selectedManuscript, setSelectedManuscript] = useState<import('../types').Manuscript | null>(null);
    const [feedback, setFeedback] = useState('');

    // Book Modal State
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<import('../types').Book | null>(null);
    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        price: '',
        category: 'Ficção',
        description: '',
        stock: '0',
        isbn: '',
        format: 'físico',
        coverUrl: '',
        digitalFileUrl: '',
        paymentInfo: '',
        paymentInfoNotes: '',
        launchDate: ''
    });
    const [coverType, setCoverType] = useState<'file' | 'link'>('file');
    const [digitalFileType, setDigitalFileType] = useState<'file' | 'link'>('file');
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [digitalFile, setDigitalFile] = useState<File | null>(null);
    const [isSavingBook, setIsSavingBook] = useState(false);

    const fetchStats = async () => {
        setIsLoadingStats(true);
        try {
            const { getAdminStats } = await import('../services/dataService');
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    const fetchBooks = async () => {
        setIsLoadingBooks(true);
        try {
            const { getBooks } = await import('../services/dataService');
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Erro ao buscar livros:', error);
        } finally {
            setIsLoadingBooks(false);
        }
    };

    const fetchUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const { getAllUsers } = await import('../services/dataService');
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Erro ao buscar utilizadores:', error);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const fetchManuscripts = async () => {
        setIsLoadingManuscripts(true);
        try {
            const { getAllManuscripts } = await import('../services/dataService');
            const data = await getAllManuscripts();
            setManuscripts(data);
        } catch (error) {
            console.error('Erro ao buscar manuscritos:', error);
        } finally {
            setIsLoadingManuscripts(false);
        }
    };

    const fetchBlogPosts = async () => {
        setIsLoadingBlog(true);
        try {
            const { getBlogPosts } = await import('../services/dataService');
            const data = await getBlogPosts();
            setBlogPosts(data);
        } catch (error) {
            console.error('Erro ao buscar posts do blog:', error);
        } finally {
            setIsLoadingBlog(false);
        }
    };

    const fetchTeamMembers = async () => {
        setIsLoadingTeam(true);
        try {
            const { getTeamMembers } = await import('../services/dataService');
            const data = await getTeamMembers();
            setTeamMembers(data);
        } catch (error) {
            console.error('Erro ao buscar membros da equipa:', error);
        } finally {
            setIsLoadingTeam(false);
        }
    };

    const fetchServices = async () => {
        setIsLoadingServices(true);
        try {
            const { getEditorialServices } = await import('../services/dataService');
            const data = await getEditorialServices();
            setEditorialServices(data);
        } catch (error) {
            console.error('Erro ao buscar serviços editoriais:', error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    const handleReviewManuscript = async (status: 'approved' | 'rejected') => {
        if (!selectedManuscript) return;
        try {
            const { updateManuscriptStatus } = await import('../services/dataService');
            await updateManuscriptStatus(selectedManuscript.id, status, feedback);
            alert(`Manuscrito ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso.`);
            setSelectedManuscript(null);
            setFeedback('');
            fetchManuscripts();
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Erro ao atualizar o status do manuscrito.');
        }
    };

    const handleSaveBook = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingBook(true);
        try {
            const { saveBook } = await import('../services/dataService');
            const { uploadFile } = await import('../services/storageService');

            let finalCoverUrl = coverType === 'link' ? bookForm.coverUrl : (editingBook?.coverUrl || '');
            let finalDigitalUrl = digitalFileType === 'link' ? bookForm.digitalFileUrl : (editingBook?.digitalFileUrl || '');

            if (coverType === 'file' && coverFile) {
                const { fileUrl } = await uploadFile(coverFile);
                finalCoverUrl = fileUrl;
            }

            if (digitalFileType === 'file' && digitalFile) {
                const { fileUrl } = await uploadFile(digitalFile);
                finalDigitalUrl = fileUrl;
            }

            await saveBook({
                id: editingBook?.id || '',
                title: bookForm.title,
                author: bookForm.author,
                price: parseInt(bookForm.price),
                category: bookForm.category,
                description: bookForm.description,
                stock: parseInt(bookForm.stock),
                isbn: bookForm.isbn,
                format: bookForm.format as 'físico' | 'digital',
                coverUrl: finalCoverUrl,
                digitalFileUrl: finalDigitalUrl,
                paymentInfo: bookForm.paymentInfo,
                paymentInfoNotes: bookForm.paymentInfoNotes,
                launchDate: bookForm.launchDate || undefined
            });

            alert('Livro guardado com sucesso!');
            setIsBookModalOpen(false);
            setEditingBook(null);
            setCoverFile(null);
            setDigitalFile(null);
            fetchBooks();
            fetchStats();
        } catch (error) {
            console.error('Erro ao salvar livro:', error);
            alert('Erro ao salvar livro. Verifique os dados e tente novamente.');
        } finally {
            setIsSavingBook(false);
        }
    };

    const handleDeleteBook = async (id: string) => {
        if (!confirm('Tem a certeza que deseja eliminar este livro?')) return;
        try {
            const { deleteBook } = await import('../services/dataService');
            await deleteBook(id);
            alert('Livro eliminado com sucesso.');
            fetchBooks();
            fetchStats();
        } catch (error) {
            console.error('Erro ao eliminar livro:', error);
            alert('Erro ao eliminar livro.');
        }
    };

    const openAddModal = () => {
        setEditingBook(null);
        setBookForm({
            title: '',
            author: '',
            price: '',
            category: 'Ficção',
            description: '',
            stock: '0',
            isbn: '',
            format: 'físico',
            coverUrl: '',
            digitalFileUrl: '',
            paymentInfo: '',
            paymentInfoNotes: '',
            launchDate: ''
        });
        setCoverType('file');
        setDigitalFileType('file');
        setCoverFile(null);
        setDigitalFile(null);
        setIsBookModalOpen(true);
    };

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingBlog(true);
        try {
            const { saveBlogPost } = await import('../services/dataService');
            await saveBlogPost(blogForm);
            alert('Post guardado com sucesso!');
            setShowBlogModal(false);
            fetchBlogPosts();
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            alert('Erro ao salvar post. Verifique os dados.');
        } finally {
            setIsSavingBlog(false);
        }
    };

    const handleDeleteBlog = async (id: string) => {
        if (!confirm('Eliminar este post?')) return;
        try {
            const { deleteBlogPost } = await import('../services/dataService');
            await deleteBlogPost(id);
            alert('Post eliminado.');
            fetchBlogPosts();
        } catch (error) {
            console.error('Erro ao eliminar post:', error);
            alert('Erro ao eliminar post.');
        }
    };

    const handleSaveTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingTeam(true);
        try {
            const { saveTeamMember } = await import('../services/dataService');
            await saveTeamMember(teamForm);
            alert('Membro guardado com sucesso!');
            setShowTeamModal(false);
            fetchTeamMembers();
        } catch (error) {
            console.error('Erro ao salvar membro:', error);
            alert('Erro ao salvar membro.');
        } finally {
            setIsSavingTeam(false);
        }
    };

    const handleDeleteTeam = async (id: string) => {
        if (!confirm('Eliminar este membro?')) return;
        try {
            const { deleteTeamMember } = await import('../services/dataService');
            await deleteTeamMember(id);
            alert('Membro eliminado.');
            fetchTeamMembers();
        } catch (error) {
            console.error('Erro ao eliminar membro:', error);
            alert('Erro ao eliminar membro.');
        }
    };

    const handleSaveService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingService(true);
        try {
            const { saveEditorialService } = await import('../services/dataService');
            await saveEditorialService(serviceForm);
            alert('Serviço guardado com sucesso!');
            setShowServiceModal(false);
            fetchServices();
        } catch (error) {
            console.error('Erro ao salvar serviço:', error);
            alert('Erro ao salvar serviço. Verifique se os dados estão corretos.');
        } finally {
            setIsSavingService(false);
        }
    };

    const handleDeleteService = async (id: string) => {
        if (!confirm('Eliminar este serviço?')) return;
        try {
            const { deleteEditorialService } = await import('../services/dataService');
            await deleteEditorialService(id);
            alert('Serviço eliminado.');
            fetchServices();
        } catch (error) {
            console.error('Erro ao eliminar serviço:', error);
            alert('Erro ao eliminar serviço.');
        }
    };

    const openEditModal = (book: import('../types').Book) => {
        setEditingBook(book);
        setBookForm({
            title: book.title,
            author: book.author,
            price: book.price.toString(),
            category: book.category,
            description: book.description,
            stock: (book.stock || 0).toString(),
            isbn: book.isbn || '',
            format: book.format || 'físico',
            coverUrl: book.coverUrl,
            digitalFileUrl: book.digitalFileUrl || '',
            paymentInfo: book.paymentInfo || '',
            paymentInfoNotes: book.paymentInfoNotes || '',
            launchDate: book.launchDate || ''
        });
        setCoverType(book.coverUrl.startsWith('http') && !book.coverUrl.includes('appwrite') ? 'link' : 'file');
        setDigitalFileType(book.digitalFileUrl?.startsWith('http') && !book.digitalFileUrl.includes('appwrite') ? 'link' : 'file');
        setCoverFile(null);
        setDigitalFile(null);
        setIsBookModalOpen(true);
    };

    useEffect(() => {
        if (activeTab === 'stats') fetchStats();
        if (activeTab === 'books') fetchBooks();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'manuscripts') fetchManuscripts();
        if (activeTab === 'blog') fetchBlogPosts();
        if (activeTab === 'team') fetchTeamMembers();
        if (activeTab === 'services') fetchServices();
    }, [activeTab]);

    if (!user || user.role !== 'adm') {
        return (
            <div className="min-h-screen bg-brand-light flex items-center justify-center p-8">
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
                    <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-brand-dark mb-4">Acesso Restrito</h2>
                    <p className="text-gray-600 mb-8">Esta área é exclusiva para administradores.</p>
                    <button
                        onClick={() => onNavigate('HOME')}
                        title="Voltar para a página inicial"
                        aria-label="Voltar para a página inicial"
                        className="btn-premium w-full justify-center"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-light">
            {/* Header */}
            <section className="bg-brand-dark text-white py-16">
                <div className="container mx-auto px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">
                            Painel <span className="text-brand-primary">Administrativo</span>
                        </h1>
                        <p className="text-gray-300">Gerencie livros, utilizadores e pedidos</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white/10 rounded-2xl p-6">
                            <BookOpen className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{isLoadingStats ? '...' : stats.totalBooks}</p>
                            <p className="text-sm text-gray-300">Livros</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <Users className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{isLoadingStats ? '...' : stats.totalUsers}</p>
                            <p className="text-sm text-gray-300">Utilizadores</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <ShoppingCart className="w-8 h-8 text-brand-primary mb-2" />
                            <p className="text-3xl font-black mb-1">{isLoadingStats ? '...' : stats.pendingOrders}</p>
                            <p className="text-sm text-gray-300">Pedidos Pendentes</p>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-6">
                            <p className="text-3xl font-black mb-1">
                                {isLoadingStats ? '...' : (stats.revenue >= 1000000
                                    ? `${(stats.revenue / 1000000).toFixed(1)}M`
                                    : stats.revenue.toLocaleString())}
                            </p>
                            <p className="text-sm text-gray-300">Receita (Kz)</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setActiveTab('books')}
                            title="Ver listagem de livros"
                            aria-label="Ver listagem de livros"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'books'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Livros
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            title="Gerir utilizadores"
                            aria-label="Gerir utilizadores"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'users'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Utilizadores
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            title="Ver encomendas"
                            aria-label="Ver encomendas"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'orders'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4 inline mr-2" />
                            Pedidos
                        </button>
                        <button
                            onClick={() => setActiveTab('manuscripts')}
                            title="Rever manuscritos"
                            aria-label="Rever manuscritos"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'manuscripts'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Manuscritos
                        </button>
                        <button
                            onClick={() => setActiveTab('blog')}
                            title="Gerir blog"
                            aria-label="Gerir blog"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'blog'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <FileText className="w-4 h-4 inline mr-2" />
                            Blog
                        </button>
                        <button
                            onClick={() => setActiveTab('team')}
                            title="Gerir equipa"
                            aria-label="Gerir equipa"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'team'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Equipa
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            title="Gerir serviços"
                            aria-label="Gerir serviços"
                            className={`px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${activeTab === 'services'
                                ? 'bg-brand-primary text-white'
                                : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                        >
                            <Layout className="w-4 h-4 inline mr-2" />
                            Serviços
                        </button>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-6 md:py-12">
                <div className="container mx-auto px-4 md:px-8">
                    {/* Books Tab */}
                    {activeTab === 'books' && (
                        <div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão de Livros</h2>
                                <button
                                    onClick={openAddModal}
                                    title="Registar novo livro"
                                    aria-label="Registar novo livro"
                                    className="btn-premium w-full sm:w-auto justify-center"
                                >
                                    <Plus className="w-5 h-5" />
                                    Adicionar Livro
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Categoria</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Formato</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingBooks ? (
                                            <tr>
                                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic">Carregando livros...</td>
                                            </tr>
                                        ) : books.length > 0 ? (
                                            books.map((book) => (
                                                <tr key={book.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{book.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${book.format === 'digital' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                                            {book.format || 'físico'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-brand-primary text-right">{book.price.toLocaleString()} Kz</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{book.stock}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(book)}
                                                                title="Editar livro"
                                                                aria-label="Editar livro"
                                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBook(book.id)}
                                                                title="Eliminar livro"
                                                                aria-label="Eliminar livro"
                                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Nenhum livro cadastrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Gestão de Utilizadores</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[700px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Tipo</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data de Registo</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingUsers ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Carregando utilizadores...</td>
                                            </tr>
                                        ) : users.length > 0 ? (
                                            users.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{u.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === 'admin' || u.role === 'adm' ? 'bg-purple-100 text-purple-600' :
                                                            u.role === 'author' ? 'bg-blue-100 text-blue-600' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {u.role === 'admin' || u.role === 'adm' ? 'Admin' : u.role === 'author' ? 'Autor' : 'Leitor'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(u.joined || Date.now()).toLocaleDateString('pt-AO')}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button title="Editar utilizador" aria-label="Editar utilizador" className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center ml-auto">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum utilizador encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <AdminOrdersTab user={user} />
                    )}

                    {/* Manuscripts Tab */}
                    {activeTab === 'manuscripts' && (
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Revisão de Manuscritos</h2>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Género</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingManuscripts ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Carregando manuscritos...</td>
                                            </tr>
                                        ) : manuscripts.length > 0 ? (
                                            manuscripts.map((m) => (
                                                <tr key={m.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{m.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{m.authorName}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 uppercase text-[10px]">{m.genre}</td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${m.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                            m.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                                                'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {m.status === 'approved' ? 'Aprovado' : m.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(m.submittedDate).toLocaleDateString('pt-AO')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => setSelectedManuscript(m)}
                                                            title="Analisar este manuscrito"
                                                            aria-label="Analisar este manuscrito"
                                                            className="px-4 py-2 bg-brand-primary text-white text-xs font-bold rounded-lg hover:brightness-110 transition-all uppercase tracking-wider"
                                                        >
                                                            Analisar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Nenhum manuscrito submetido.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Blog Tab */}
                    {activeTab === 'blog' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão do Blog</h2>
                                <button
                                    onClick={() => {
                                        setBlogForm({ title: '', content: '', imageUrl: '', author: '', date: new Date().toISOString().split('T')[0] });
                                        setShowBlogModal(true);
                                    }}
                                    title="Criar novo post"
                                    aria-label="Criar novo post"
                                    className="btn-premium py-3 px-6 text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Novo Post
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Título</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Autor</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingBlog ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Carregando posts...</td>
                                            </tr>
                                        ) : blogPosts.length > 0 ? (
                                            blogPosts.map((post) => (
                                                <tr key={post.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{post.title}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(post.date).toLocaleDateString('pt-AO')}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setBlogForm(post);
                                                                    setShowBlogModal(true);
                                                                }}
                                                                title="Editar post"
                                                                aria-label="Editar post"
                                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteBlog(post.id)}
                                                                title="Eliminar post"
                                                                aria-label="Eliminar post"
                                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Nenhum post encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Team Tab */}
                    {activeTab === 'team' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão da Equipa</h2>
                                <button
                                    onClick={() => {
                                        setTeamForm({ name: '', role: '', department: '', bio: '', photoUrl: '', order: 0 });
                                        setShowTeamModal(true);
                                    }}
                                    title="Adicionar novo membro"
                                    aria-label="Adicionar novo membro"
                                    className="btn-premium py-3 px-6 text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Novo Membro
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Nome</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Cargo</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Departamento</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ordem</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingTeam ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Carregando equipa...</td>
                                            </tr>
                                        ) : teamMembers.length > 0 ? (
                                            teamMembers.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{member.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{member.department}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{member.order}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setTeamForm(member);
                                                                    setShowTeamModal(true);
                                                                }}
                                                                title="Editar membro"
                                                                aria-label="Editar membro"
                                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTeam(member.id)}
                                                                title="Eliminar membro"
                                                                aria-label="Eliminar membro"
                                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Nenhum membro encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Services Tab */}
                    {activeTab === 'services' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl md:text-3xl font-black text-brand-dark">Gestão de Serviços</h2>
                                <button
                                    onClick={() => {
                                        setServiceForm({ title: '', price: '', details: [], order: 0 });
                                        setShowServiceModal(true);
                                    }}
                                    title="Criar novo serviço"
                                    aria-label="Criar novo serviço"
                                    className="btn-premium py-3 px-6 text-sm"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Novo Serviço
                                </button>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Serviço</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-brand-dark uppercase tracking-wider">Preço</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ordem</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-brand-dark uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoadingServices ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Carregando serviços...</td>
                                            </tr>
                                        ) : editorialServices.length > 0 ? (
                                            editorialServices.map((service) => (
                                                <tr key={service.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-bold text-brand-dark">{service.title}</td>
                                                    <td className="px-6 py-4 text-sm text-brand-primary font-black">{service.price}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 text-right">{service.order}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setServiceForm(service);
                                                                    setShowServiceModal(true);
                                                                }}
                                                                title="Editar serviço"
                                                                aria-label="Editar serviço"
                                                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteService(service.id)}
                                                                title="Eliminar serviço"
                                                                aria-label="Eliminar serviço"
                                                                className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">Nenhum serviço encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Review Modal */}
            {selectedManuscript && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">Análise de Obra</span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {selectedManuscript.title}
                                    </h3>
                                    <p className="text-gray-500 mt-2 font-medium">Por {selectedManuscript.authorName}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedManuscript(null)}
                                    title="Fechar análise"
                                    aria-label="Fechar análise"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <XCircle className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="text-sm font-black text-brand-dark uppercase tracking-wider mb-3">Sinopse</h4>
                                    <p className="text-gray-600 leading-relaxed text-sm italic">"{selectedManuscript.synopsis}"</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Género</p>
                                        <p className="text-brand-dark font-bold uppercase text-xs">{selectedManuscript.genre}</p>
                                    </div>
                                    <div className="border border-gray-100 rounded-2xl p-4">
                                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Páginas</p>
                                        <p className="text-brand-dark font-bold text-xs">{selectedManuscript.pages || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="manuscript-feedback" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-3">Feedback ao Autor</label>
                                    <textarea
                                        id="manuscript-feedback"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        title="Caixa de feedback para o autor"
                                        placeholder="Escreva a sua análise ou motivo da rejeição..."
                                        className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm text-gray-600 focus:ring-2 focus:ring-brand-primary h-32 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={selectedManuscript.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Descarregar e ler o manuscrito"
                                        aria-label="Descarregar e ler o manuscrito"
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark text-center hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Ler Obra
                                    </a>
                                    <button
                                        onClick={() => handleReviewManuscript('rejected')}
                                        title="Rejeitar manuscrito"
                                        aria-label="Rejeitar manuscrito"
                                        className="flex-1 py-4 bg-red-50 text-red-600 rounded-full font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all"
                                    >
                                        Rejeitar
                                    </button>
                                    <button
                                        onClick={() => handleReviewManuscript('approved')}
                                        title="Aprovar manuscrito"
                                        aria-label="Aprovar manuscrito"
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all"
                                    >
                                        Aprovar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Book Modal */}
            {isBookModalOpen && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">
                                        {editingBook ? 'Editar Livro' : 'Adicionar Novo Livro'}
                                    </span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {editingBook ? editingBook.title : 'Detalhes do Livro'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsBookModalOpen(false)}
                                    title="Fechar modal"
                                    aria-label="Fechar modal"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveBook} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Formato da Obra</label>
                                            <div className="flex gap-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setBookForm({ ...bookForm, format: 'físico' })}
                                                    title="Selecionar formato físico"
                                                    aria-label="Selecionar formato físico"
                                                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${bookForm.format === 'físico' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    Físico
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setBookForm({ ...bookForm, format: 'digital' })}
                                                    title="Selecionar formato digital"
                                                    aria-label="Selecionar formato digital"
                                                    className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${bookForm.format === 'digital' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    Digital (e-book)
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="book-title" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Título</label>
                                            <input
                                                id="book-title"
                                                type="text"
                                                required
                                                placeholder="Digite o título do livro"
                                                title="Título do livro"
                                                value={bookForm.title}
                                                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="book-author" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Autor</label>
                                            <input
                                                id="book-author"
                                                type="text"
                                                required
                                                placeholder="Nome do autor"
                                                title="Autor do livro"
                                                value={bookForm.author}
                                                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="book-price" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Preço (Kz)</label>
                                                <input
                                                    id="book-price"
                                                    type="number"
                                                    required
                                                    placeholder="0"
                                                    title="Preço do livro"
                                                    value={bookForm.price}
                                                    onChange={(e) => setBookForm({ ...bookForm, price: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="book-stock" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Stock</label>
                                                <input
                                                    id="book-stock"
                                                    type="number"
                                                    required
                                                    placeholder="0"
                                                    title="Stock disponível"
                                                    value={bookForm.stock}
                                                    onChange={(e) => setBookForm({ ...bookForm, stock: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="book-category" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Categoria</label>
                                            <select
                                                id="book-category"
                                                required
                                                title="Selecione a categoria"
                                                value={bookForm.category}
                                                onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            >
                                                <option value="Ficção">Ficção</option>
                                                <option value="Romance">Romance</option>
                                                <option value="História">História</option>
                                                <option value="Poesia">Poesia</option>
                                                <option value="Técnico">Técnico</option>
                                                <option value="Religião">Religião</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6">
                                        <h4 className="font-bold text-brand-dark mb-4 text-sm uppercase tracking-wide">Dados de Pagamento (Opcional)</h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Informações de Pagamento (IBAN/Conta)</label>
                                                <input
                                                    type="text"
                                                    value={bookForm.paymentInfo}
                                                    onChange={e => setBookForm({ ...bookForm, paymentInfo: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                    placeholder="Ex: IBAN AO06..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Notas de Pagamento</label>
                                                <input
                                                    type="text"
                                                    value={bookForm.paymentInfoNotes}
                                                    onChange={e => setBookForm({ ...bookForm, paymentInfoNotes: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                    placeholder="Ex: Enviar comprovativo para..."
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label htmlFor="book-launch-date" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Data de Lançamento (Opcional)</label>
                                            <input
                                                id="book-launch-date"
                                                type="datetime-local"
                                                title="Data de Lançamento"
                                                value={bookForm.launchDate || ''}
                                                onChange={(e) => setBookForm({ ...bookForm, launchDate: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="book-description" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Descrição</label>
                                            <textarea
                                                id="book-description"
                                                required
                                                placeholder="Resumo do livro..."
                                                title="Descrição do livro"
                                                value={bookForm.description}
                                                onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary h-32 resize-none"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="book-isbn" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">ISBN (Opcional)</label>
                                            <input
                                                id="book-isbn"
                                                type="text"
                                                placeholder="Ex: 978-3-16-148410-0"
                                                title="Código ISBN"
                                                value={bookForm.isbn}
                                                onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 pt-2">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">Capa</label>
                                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCoverType('file')}
                                                            title="Carregar ficheiro de imagem"
                                                            aria-label="Carregar ficheiro de imagem"
                                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${coverType === 'file' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
                                                        >
                                                            Upload
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCoverType('link')}
                                                            title="Introduzir link da imagem"
                                                            aria-label="Introduzir link da imagem"
                                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${coverType === 'link' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
                                                        >
                                                            Link
                                                        </button>
                                                    </div>
                                                </div>
                                                {coverType === 'file' ? (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                                                            className="hidden"
                                                            id="cover-upload"
                                                            title="Carregar capa"
                                                        />
                                                        <label htmlFor="cover-upload" className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all min-h-[100px]">
                                                            <Image className="w-6 h-6 text-gray-400 mb-1" />
                                                            <span className="text-[10px] text-gray-500 font-bold uppercase truncate w-full text-center">
                                                                {coverFile ? coverFile.name : (editingBook ? 'Alterar Capa' : 'Clique para Carregar')}
                                                            </span>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <input
                                                        id="cover-link"
                                                        type="text"
                                                        placeholder="https://exemplo.com/capa.jpg"
                                                        title="Link direto da imagem da capa"
                                                        value={bookForm.coverUrl}
                                                        onChange={(e) => setBookForm({ ...bookForm, coverUrl: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="block text-xs font-black text-brand-dark uppercase tracking-wider">Ficheiro Digital (Opcional)</label>
                                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDigitalFileType('file')}
                                                            title="Carregar ficheiro (PDF/EPUB)"
                                                            aria-label="Carregar ficheiro (PDF/EPUB)"
                                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${digitalFileType === 'file' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
                                                        >
                                                            Upload
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDigitalFileType('link')}
                                                            title="Introduzir link do ficheiro"
                                                            aria-label="Introduzir link do ficheiro"
                                                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${digitalFileType === 'link' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-400'}`}
                                                        >
                                                            Link
                                                        </button>
                                                    </div>
                                                </div>
                                                {digitalFileType === 'file' ? (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.epub"
                                                            onChange={(e) => setDigitalFile(e.target.files?.[0] || null)}
                                                            className="hidden"
                                                            id="digital-upload"
                                                            title="Carregar ficheiro digital"
                                                        />
                                                        <label htmlFor="digital-upload" className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-all min-h-[100px]">
                                                            <File className="w-6 h-6 text-gray-400 mb-1" />
                                                            <span className="text-[10px] text-gray-500 font-bold uppercase truncate w-full text-center">
                                                                {digitalFile ? digitalFile.name : (editingBook?.digitalFileUrl ? 'Alterar Digital' : 'Clique para Carregar')}
                                                            </span>
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <input
                                                        id="digital-link"
                                                        type="text"
                                                        placeholder="https://exemplo.com/livro.pdf"
                                                        title="Link direto do ficheiro digital"
                                                        value={bookForm.digitalFileUrl}
                                                        onChange={(e) => setBookForm({ ...bookForm, digitalFileUrl: e.target.value })}
                                                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        disabled={isSavingBook}
                                        onClick={() => setIsBookModalOpen(false)}
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all disabled:opacity-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingBook}
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSavingBook ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                {editingBook ? 'Guardar Alterações' : 'Criar Livro'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Blog Modal */}
            {showBlogModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">
                                        Post do Blog
                                    </span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {blogForm.id ? 'Editar Post' : 'Novo Post'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowBlogModal(false)}
                                    title="Fechar modal"
                                    aria-label="Fechar modal"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveBlog} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="blog-title" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Título</label>
                                        <input
                                            id="blog-title"
                                            required
                                            type="text"
                                            title="Título do post"
                                            placeholder="Introduza o título"
                                            value={blogForm.title}
                                            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="blog-author" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Autor</label>
                                            <input
                                                id="blog-author"
                                                required
                                                type="text"
                                                title="Autor do post"
                                                placeholder="Nome do autor"
                                                value={blogForm.author}
                                                onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="blog-date" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Data</label>
                                            <input
                                                id="blog-date"
                                                required
                                                type="date"
                                                title="Data do post"
                                                value={blogForm.date}
                                                onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="blog-image" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Imagem (URL)</label>
                                        <input
                                            id="blog-image"
                                            type="text"
                                            title="URL da imagem do post"
                                            value={blogForm.imageUrl}
                                            onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="blog-content" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Conteúdo</label>
                                        <textarea
                                            id="blog-content"
                                            required
                                            title="Conteúdo do post"
                                            placeholder="Escreva o conteúdo do post..."
                                            value={blogForm.content}
                                            onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary h-48 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowBlogModal(false)}
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingBlog}
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSavingBlog ? 'Salvando...' : 'Salvar Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Team Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">
                                        Membro da Equipa
                                    </span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {teamForm.id ? 'Editar Membro' : 'Novo Membro'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowTeamModal(false)}
                                    title="Fechar modal"
                                    aria-label="Fechar modal"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveTeam} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="team-name" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Nome</label>
                                        <input
                                            id="team-name"
                                            required
                                            type="text"
                                            title="Nome do membro"
                                            placeholder="Nome completo"
                                            value={teamForm.name}
                                            onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="team-role" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Cargo</label>
                                            <input
                                                id="team-role"
                                                required
                                                type="text"
                                                title="Cargo do membro"
                                                placeholder="Ex: Editor Chefe"
                                                value={teamForm.role}
                                                onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="team-department" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Departamento</label>
                                            <select
                                                id="team-department"
                                                required
                                                title="Departamento"
                                                value={teamForm.department}
                                                onChange={(e) => setTeamForm({ ...teamForm, department: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            >
                                                <option value="">Selecionar...</option>
                                                <option value="Editorial">Editorial</option>
                                                <option value="Administrativo">Administrativo</option>
                                                <option value="Logística">Logística</option>
                                                <option value="Comercial">Comercial</option>
                                                <option value="Marketing">Marketing</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="team-photo" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Foto (URL)</label>
                                            <input
                                                id="team-photo"
                                                type="text"
                                                title="URL da foto"
                                                placeholder="https://..."
                                                value={teamForm.photoUrl}
                                                onChange={(e) => setTeamForm({ ...teamForm, photoUrl: e.target.value })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="team-order" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Ordem de Exibição</label>
                                            <input
                                                id="team-order"
                                                type="number"
                                                title="Ordem de exibição"
                                                placeholder="0"
                                                value={teamForm.order}
                                                onChange={(e) => setTeamForm({ ...teamForm, order: parseInt(e.target.value) })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="team-bio" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Bio</label>
                                        <textarea
                                            id="team-bio"
                                            required
                                            title="Bio do membro"
                                            placeholder="Escreva uma breve biografia..."
                                            value={teamForm.bio}
                                            onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary h-32 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTeamModal(false)}
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingTeam}
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSavingTeam ? 'Salvando...' : 'Salvar Membro'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Modal */}
            {showServiceModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="p-8 md:p-12 overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="text-brand-primary font-black uppercase tracking-widest text-xs mb-2 block italic">
                                        Serviço Editorial
                                    </span>
                                    <h3 className="text-4xl font-black text-brand-dark tracking-tighter leading-none">
                                        {serviceForm.id ? 'Editar Serviço' : 'Novo Serviço'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowServiceModal(false)}
                                    title="Fechar modal"
                                    aria-label="Fechar modal"
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <form onSubmit={handleSaveService} className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="service-title" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Título do Serviço</label>
                                        <input
                                            id="service-title"
                                            required
                                            type="text"
                                            title="Título do serviço"
                                            placeholder="Ex: Revisão Linguística"
                                            value={serviceForm.title}
                                            onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="service-price" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Preço (ou Sob Consulta)</label>
                                            <input
                                                id="service-price"
                                                required
                                                type="text"
                                                title="Preço do serviço"
                                                value={serviceForm.price}
                                                onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                                placeholder="Ex: 50.000 Kz"
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="service-order" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Ordem</label>
                                            <input
                                                id="service-order"
                                                type="number"
                                                title="Ordem de exibição"
                                                placeholder="0"
                                                value={serviceForm.order}
                                                onChange={(e) => setServiceForm({ ...serviceForm, order: parseInt(e.target.value) })}
                                                className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="service-details" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Detalhes (um por linha)</label>
                                        <textarea
                                            id="service-details"
                                            required
                                            title="Detalhes do serviço"
                                            value={serviceForm.details.join('\n')}
                                            onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value.split('\n') })}
                                            placeholder="Detalhe 1&#10;Detalhe 2..."
                                            className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary h-32 resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowServiceModal(false)}
                                        className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSavingService}
                                        className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSavingService ? 'Salvando...' : 'Salvar Serviço'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AdminOrdersTab: React.FC<{ user: User }> = ({ user }) => {
    const [notifications, setNotifications] = useState<import('../types').PaymentNotification[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const { getAllPaymentNotifications } = await import('../services/dataService');
            const data = await getAllPaymentNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const handleConfirm = async (notif: import('../types').PaymentNotification) => {
        if (!confirm(`Confirmar pagamento de ${notif.readerName} no valor de ${notif.totalAmount} Kz?`)) return;

        try {
            const { updatePaymentNotificationStatus, confirmPaymentProof, getPaymentProofByNotification } = await import('../services/dataService');
            const { sendPaymentConfirmationToReader } = await import('../services/emailService');

            await updatePaymentNotificationStatus(notif.id, 'confirmed');

            const proof = await getPaymentProofByNotification(notif.id);
            if (proof) {
                await confirmPaymentProof(proof.id, user.id, 'Pagamento confirmado via painel administrativo.');
            }

            // Notify reader
            const titles = notif.items.map(item => item.bookTitle);
            await sendPaymentConfirmationToReader(notif.readerEmail, notif.readerName, titles);

            alert('Pagamento confirmado e leitor notificado!');
            fetchNotifications();
        } catch (error) {
            console.error('Erro ao confirmar:', error);
            alert('Erro ao confirmar pagamento.');
        }
    };

    if (isLoading) return <div className="text-center py-12 text-brand-dark/50 font-bold uppercase tracking-widest text-xs">Carregando pagamentos...</div>;

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-black text-brand-dark mb-8">Gestão de Pagamentos</h2>
            <div className="bg-white rounded-[32px] shadow-xl overflow-hidden border border-gray-100 overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Data</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Leitor</th>
                            <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Itens / Autores</th>
                            <th className="px-6 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-6 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {notifications.map((n) => (
                            <tr key={n.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-6">
                                    <div className="text-xs font-mono font-bold text-brand-dark">#{n.orderId?.substring(0, 8)}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                                </td>
                                <td className="px-6 py-6">
                                    <div className="font-bold text-brand-dark text-sm">{n.readerName}</div>
                                    <div className="text-[10px] text-gray-400 font-medium">{n.readerEmail}</div>
                                </td>
                                <td className="px-6 py-6 font-medium">
                                    {n.items.map((item, i) => (
                                        <div key={i} className="text-[11px] mb-1 text-gray-600">
                                            <span className="font-bold text-brand-dark">{item.bookTitle}</span>
                                            <span className="text-gray-400 ml-1 italic">({item.authorName})</span>
                                        </div>
                                    ))}
                                </td>
                                <td className="px-6 py-6 text-right font-black text-brand-primary">
                                    {n.totalAmount.toLocaleString()} Kz
                                </td>
                                <td className="px-6 py-6">
                                    <div className="flex items-center justify-center gap-2">
                                        {n.status === 'proof_uploaded' && (
                                            <button
                                                onClick={async () => {
                                                    const { getPaymentProofByNotification } = await import('../services/dataService');
                                                    const proof = await getPaymentProofByNotification(n.id);
                                                    if (proof) window.open(proof.fileUrl, '_blank');
                                                }}
                                                title="Visualizar comprovativo de pagamento"
                                                aria-label="Visualizar comprovativo de pagamento"
                                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
                                            >
                                                Ver Comprovativo
                                            </button>
                                        )}
                                        {n.status !== 'confirmed' ? (
                                            <button
                                                onClick={() => handleConfirm(n)}
                                                title="Confirmar este pagamento"
                                                aria-label="Confirmar este pagamento"
                                                className="px-4 py-2 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all"
                                            >
                                                Confirmar
                                            </button>
                                        ) : (
                                            <span className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest bg-green-50 px-4 py-2 rounded-xl">
                                                <CheckCircle className="w-3 h-3" /> Pago
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {notifications.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                                    Nenhuma notificação de pagamento pendente.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
