import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminBlogTab: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<any[]>([]);
    const [isLoadingBlog, setIsLoadingBlog] = useState(true);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [blogForm, setBlogForm] = useState<any>({ title: '', content: '', imageUrl: '', author: '', date: new Date().toISOString().split('T')[0] });
    const [isSavingBlog, setIsSavingBlog] = useState(false);

    const fetchBlogPosts = async () => {
        setIsLoadingBlog(true);
        try {
            const { getBlogPosts } = await import('../../services/dataService');
            const data = await getBlogPosts();
            setBlogPosts(data);
        } catch (error) {
            console.error('Erro ao buscar posts do blog:', error);
        } finally {
            setIsLoadingBlog(false);
        }
    };

    useEffect(() => {
        fetchBlogPosts();
    }, []);

    const handleSaveBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingBlog(true);
        try {
            const { saveBlogPost } = await import('../../services/dataService');
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
            const { deleteBlogPost } = await import('../../services/dataService');
            await deleteBlogPost(id);
            alert('Post eliminado.');
            fetchBlogPosts();
        } catch (error) {
            console.error('Erro ao eliminar post:', error);
            alert('Erro ao eliminar post.');
        }
    };

    return (
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

            {/* Blog Modal */}
            {showBlogModal && (
                <div className="fixed inset-0 bg-brand-dark/90 backdrop-blur-sm z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-fade-in">
                        <div className="p-8 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-2xl font-black text-brand-dark">{blogForm.id ? 'Editar Post' : 'Novo Post'}</h2>
                        </div>
                        <form onSubmit={handleSaveBlog} className="flex-1 overflow-y-auto p-8 space-y-6">
                            <div>
                                <label htmlFor="blog-title" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Título do Post</label>
                                <input
                                    id="blog-title"
                                    type="text"
                                    required
                                    value={blogForm.title}
                                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary font-bold"
                                    placeholder="Ex: Lançamento de Novos Livros"
                                    title="Título do Post"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="blog-author" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Autor</label>
                                    <input
                                        id="blog-author"
                                        type="text"
                                        required
                                        value={blogForm.author}
                                        onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        placeholder="Nome do Autor"
                                        title="Nome do Autor"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="blog-date" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Data</label>
                                    <input
                                        id="blog-date"
                                        type="date"
                                        required
                                        value={blogForm.date}
                                        onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                                        className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                        title="Data do Post"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="blog-image" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">URL da Imagem</label>
                                <input
                                    id="blog-image"
                                    type="url"
                                    required
                                    value={blogForm.imageUrl}
                                    onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary"
                                    placeholder="https://..."
                                    title="URL da Imagem"
                                />
                            </div>
                            <div>
                                <label htmlFor="blog-content" className="block text-xs font-black text-brand-dark uppercase tracking-wider mb-2">Conteúdo</label>
                                <textarea
                                    id="blog-content"
                                    required
                                    value={blogForm.content}
                                    onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                                    className="w-full bg-gray-50 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-brand-primary h-64 resize-none"
                                    placeholder="Escreva o conteúdo do post..."
                                    title="Conteúdo do Post"
                                />
                            </div>
                        </form>
                        <div className="p-6 border-t border-gray-100 flex gap-4 bg-white/50 backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => setShowBlogModal(false)}
                                className="flex-1 py-4 border-2 border-brand-dark rounded-full font-black text-xs uppercase tracking-widest text-brand-dark hover:bg-brand-dark hover:text-white transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveBlog}
                                disabled={isSavingBlog}
                                className="flex-1 py-4 bg-brand-primary text-white rounded-full font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSavingBlog ? 'Salvando...' : 'Salvar Post'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBlogTab;
