import { Card } from 'antd';

interface FormLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormLayout({ children, fullWidth = false }: FormLayoutProps) {
  return (
    <div style={{ padding: fullWidth ? '0' : '24px', height: fullWidth ? 'auto' : 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card
        style={{
          maxWidth: fullWidth ? '100%' : '600px',
          margin: fullWidth ? 0 : '0 auto',
          padding: fullWidth ? 0 : '24px',
        }}
        role="main"
        aria-labelledby="form-title"
        bodyStyle={fullWidth ? { padding: '0 24px 24px' } : undefined}
      >
        {children}
      </Card>
    </div>
  );
}

export default FormLayout;
