import {Card} from 'antd';

function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
      <Card
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '24px',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {children}
      </Card>
    </div>
  );
}

export default FormLayout;
