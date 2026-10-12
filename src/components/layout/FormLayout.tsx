import { Card } from 'antd';

interface FormLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

function FormLayout({ children, fullWidth = false }: FormLayoutProps) {
  return (
    <div
      className={fullWidth ? undefined : 'p-2 md:p-6'}
      style={{ height: fullWidth ? 'auto' : 'calc(100dvh - 128px)', overflow: 'auto' }}
    >
      <Card
        className={fullWidth ? undefined : 'md:p-6'}
        style={{
          maxWidth: fullWidth ? '100%' : '600px',
          margin: fullWidth ? 0 : '0 auto',
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
