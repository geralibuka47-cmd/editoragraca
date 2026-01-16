import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        window.location.reload();
    };

    private handleHardReset = () => {
        // Clear all local storage and cache
        localStorage.clear();
        sessionStorage.clear();

        if ('caches' in window) {
            caches.keys().then((names) => {
                names.forEach((name) => {
                    caches.delete(name);
                });
            });
        }

        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-black text-gray-900 mb-2">Ops! Algo correu mal.</h1>
                        <p className="text-gray-500 mb-8 leading-relaxed">
                            A aplicação encontrou um erro inesperado. Isto pode acontecer devido a uma atualização recente ou dados antigos em cache.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={this.handleReset}
                                className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-brand-primary/20"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Tentar Novamente
                            </button>

                            <button
                                onClick={this.handleHardReset}
                                className="w-full py-4 bg-white border-2 border-gray-100 text-gray-500 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                                Limpar Cache e Reparar
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-gray-400">
                            Se o problema persistir, por favor contacte o suporte.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
