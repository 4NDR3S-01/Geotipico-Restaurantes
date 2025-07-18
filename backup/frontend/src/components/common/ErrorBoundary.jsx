import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import '../../styles/ErrorBoundary.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

const ErrorFallback = ({ error }) => {
  const { t } = useTranslation();

  return (
    <div className="error-boundary">
      <div className="error-boundary-content">
        <div className="error-boundary-icon">⚠️</div>
        <h2 className="error-boundary-title">
          {t('error.title', 'Algo salió mal')}
        </h2>
        <p className="error-boundary-message">
          {t('error.message', 'Ha ocurrido un error inesperado. Por favor, recarga la página.')}
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="error-boundary-details">
            <summary>{t('error.technical_details', 'Detalles técnicos')}</summary>
            <pre className="error-boundary-error">
              {error?.toString()}
            </pre>
          </details>
        )}
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          {t('error.reload', 'Recargar página')}
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object
};

export default ErrorBoundary;
