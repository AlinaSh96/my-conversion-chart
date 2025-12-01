import React, { type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';
import { makeT } from '../../constants/translations';

const t = makeT('en');

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <h1 className={styles.title}>{t('errorTitle')}</h1>
            <p className={styles.message}>
              {this.state.error?.message || t('errorUnknown')}
            </p>
            {import.meta.env.DEV && (
              <details className={styles.details}>
                <summary>{t('errorDetails')}</summary>
                <pre className={styles.stack}>
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className={styles.button}
            >
              {t('errorReload')}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
