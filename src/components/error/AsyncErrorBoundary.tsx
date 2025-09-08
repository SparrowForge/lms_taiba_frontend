import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Typography } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';

const { Title, Text } = Typography;

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
  error?: Error | null;
}

const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback,
  onRetry,
  error,
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorState, setErrorState] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setHasError(true);
      setErrorState(error);
    } else {
      setHasError(false);
      setErrorState(null);
    }
  }, [error]);

  const handleRetry = () => {
    setHasError(false);
    setErrorState(null);
    if (onRetry) {
      onRetry();
    }
  };

  if (hasError || errorState) {
    // Custom fallback UI
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    return (
      <Card style={{ margin: '16px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <ExclamationCircleOutlined
            style={{
              fontSize: '48px',
              color: '#ff4d4f',
              marginBottom: '16px',
            }}
          />

          <Title level={4} style={{ marginBottom: '8px' }}>
            Failed to load data
          </Title>

          <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
            {errorState?.message || 'An error occurred while loading the data. Please try again.'}
          </Text>

          <Alert
            message="Error Details"
            description={
              <div style={{ textAlign: 'left', fontSize: '12px' }}>
                <Text code>
                  {errorState?.name}: {errorState?.message}
                </Text>
                {process.env.NODE_ENV === 'development' && errorState?.stack && (
                  <details style={{ marginTop: '8px' }}>
                    <summary>Stack Trace</summary>
                    <pre
                      style={{
                        fontSize: '10px',
                        overflow: 'auto',
                        maxHeight: '150px',
                        backgroundColor: '#f5f5f5',
                        padding: '8px',
                        borderRadius: '4px',
                      }}
                    >
                      {errorState.stack}
                    </pre>
                  </details>
                )}
              </div>
            }
            type="error"
            showIcon
            style={{ marginBottom: '16px', textAlign: 'left' }}
          />

          <Button type="primary" icon={<ReloadOutlined />} onClick={handleRetry} size="middle">
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return <>{children}</>;
};

export default AsyncErrorBoundary;
