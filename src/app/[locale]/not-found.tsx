export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #faf5ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
        lineHeight: '1.6',
        color: '#333',
      }}
    >
      <div
        style={{
          maxWidth: '32rem',
          width: '100%',
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '3rem',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            fontSize: '7.5rem',
            color: '#3b82f6',
            marginBottom: '2rem',
            filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
          }}
        >
          🚀
        </div>

        {/* Main Content */}
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1.5rem',
            margin: '0 0 1.5rem 0',
          }}
        >
          Upcoming
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: '#4b5563',
            marginBottom: '0.5rem',
            maxWidth: '32rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {`We're building something amazing for you!`}
        </p>

        <p
          style={{
            fontSize: '1.125rem',
            color: '#6b7280',
            marginBottom: '2rem',
            maxWidth: '24rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          This feature is currently under development and will be available soon. Stay tuned for
          updates!
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '3rem',
          }}
        >
          {/* <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
              backgroundColor: '#3b82f6',
              color: 'white',
              height: '3rem',
              minHeight: '3rem',
              border: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            🏠 Go to Dashboard
          </Link> */}

          {/* <button
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              height: '3rem',
              minHeight: '3rem',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.back();
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
            }}
          >
            ← Go Back
          </button> */}
        </div>

        {/* Additional Info */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e5e7eb',
          }}
        >
          <p
            style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              margin: '0',
            }}
          >
            Need help? Contact our support team or check our documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
