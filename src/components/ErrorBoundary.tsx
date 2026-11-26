import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected application error occurred.',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application boundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center px-6 py-16">
          <div className="max-w-lg w-full bg-white border border-[#D5E0EE] p-8">
            <p className="text-xs uppercase tracking-widest text-[#8E6307] font-semibold">
              Chugu Boys Senior School
            </p>
            <h1 className="mt-2 text-2xl font-display font-semibold text-[#0E3168]">
              Something interrupted this view
            </h1>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              We encountered an issue while loading school records. Please reload the page or return
              to the homepage.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-[44px] px-5 py-2.5 text-sm font-medium bg-[#0E3168] text-white hover:bg-[#16468F] transition-colors cursor-pointer"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, message: '' })}
                className="min-h-[44px] px-5 py-2.5 text-sm font-medium border border-slate-300 text-[#0B0F17] hover:bg-[#F4F7FB] transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
