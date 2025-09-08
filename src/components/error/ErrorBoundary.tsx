import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Typography } from 'antd';
import React, { Component, ErrorInfo, ReactNode } from 'react';

const { Title, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to error reporting service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div
          style={{
            padding: '24px',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Card style={{ maxWidth: '600px', width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ color: '#ff4d4f', marginBottom: '16px' }}>
                Something went wrong
              </Title>

              <Text type="secondary" style={{ display: 'block', marginBottom: '24px' }}>
                We&apos;re sorry, but something unexpected happened. Please try again or contact
                support if the problem persists.
              </Text>

              <Alert
                message="Error Details"
                description={
                  <div style={{ textAlign: 'left', fontSize: '12px' }}>
                    <Text code>
                      {this.state.error?.name}: {this.state.error?.message}
                    </Text>
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                      <details style={{ marginTop: '8px' }}>
                        <summary>Stack Trace</summary>
                        <pre
                          style={{
                            fontSize: '10px',
                            overflow: 'auto',
                            maxHeight: '200px',
                            backgroundColor: '#f5f5f5',
                            padding: '8px',
                            borderRadius: '4px',
                          }}
                        >
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                }
                type="error"
                showIcon
                style={{ marginBottom: '24px', textAlign: 'left' }}
              />

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={this.handleReload}
                  size="large"
                >
                  Reload Page
                </Button>
                <Button icon={<HomeOutlined />} onClick={this.handleGoHome} size="large">
                  Go Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
