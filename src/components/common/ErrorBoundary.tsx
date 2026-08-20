import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Suppress browser extension injection errors (e.g., TronLink, Web3 wallet injection)
    if (
      error &&
      error.message &&
      (error.message.includes('tronlinkParams') ||
        error.message.includes('trap returned falsish'))
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (
      error &&
      error.message &&
      (error.message.includes('tronlinkParams') ||
        error.message.includes('trap returned falsish'))
    ) {
      return;
    }
    console.error('Uncaught component error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white p-8 border border-slate-200 shadow-md text-center space-y-4">
            <h2 className="text-xl font-bold text-[#0A192F]">Application Notice</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              An unexpected runtime state was encountered. Please refresh the page to continue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#F27D26] hover:bg-[#d96a1a] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors"
            >
              Refresh Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
