function FormLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '24px', height: 'calc(100vh - 128px)', overflow: 'auto' }}>
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#fff',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    }}
    role="main"
    aria-labelledby="form-title"
  >
    {children}
  </div>
</div>;
}

export default FormLayout;