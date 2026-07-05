import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@components/ui/Logo.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, this would send to Sentry / Datadog / etc.
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback) {
        return <Fallback error={this.state.error} onReset={this.handleReset} />;
      }

      return (
        <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center px-6 text-center">
          <div className="mb-8">
            <Logo size="lg" />
          </div>

          <div className="w-14 h-14 rounded-full bg-brand-500/10 flex items-center justify-center mx-auto mb-5">
            <span className="text-brand-500 text-2xl">⚠</span>
          </div>

          <h1 className="font-display text-3xl font-bold text-white uppercase tracking-wide mb-3">
            Something Went Wrong
          </h1>
          <p className="text-white/40 text-sm max-w-sm mb-8 leading-relaxed">
            An unexpected error occurred. Our team has been notified. Please try refreshing the page.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mb-6 text-left max-w-lg w-full">
              <summary className="text-xs text-white/30 cursor-pointer hover:text-white/50 mb-2">
                Error Details (dev only)
              </summary>
              <pre className="text-xs text-red-400 bg-red-900/10 border border-red-500/20 rounded-lg p-4 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-md hover:bg-brand-600 transition-colors"
            >
              Refresh Page
            </button>
            <Link
              to="/browse"
              onClick={this.handleReset}
              className="px-6 py-3 bg-white/10 text-white font-semibold rounded-md hover:bg-white/15 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight inline error boundary for contained UI sections.
 */
export class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-8 text-center">
          <p className="text-white/30 text-sm">This section failed to load.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
