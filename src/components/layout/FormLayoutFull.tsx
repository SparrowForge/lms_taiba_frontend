import {Card} from 'antd';

function FormLayoutFull({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-2 md:p-6" style={{ height: 'calc(100dvh - 128px)', overflow: 'auto' }}>
      <Card
        className="md:p-6"
        style={{
          width: '100%',
          margin: '0 auto',
        }}
        role="main"
        aria-labelledby="form-title"
      >
        {children}
      </Card>
    </div>
  );
}

export default FormLayoutFull;
