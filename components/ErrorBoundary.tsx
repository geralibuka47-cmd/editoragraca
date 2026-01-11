import React, { Component, ErrorInfo, ReactNode } from "react";

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
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white p-4">
                    <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-red-700 mb-2">Algo correu mal.</h2>
                        <p className="text-red-600 mb-4">
                            Ocorreu um erro ao carregar a aplicação.
                        </p>
                        <pre className="bg-white p-4 rounded border text-xs overflow-auto max-h-40 text-red-500">
                            {this.state.error?.message}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
