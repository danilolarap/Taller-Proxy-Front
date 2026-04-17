'use client';

import { useMetrics } from '@/hooks/useMetrics';
import ServiceCard from '@/components/ServiceCard';
import MetricsChart from '@/components/MetricsChart';
import LogTable from '@/components/LogTable';

export default function Dashboard() {
  const { metrics, logs, simulateLoad, loading } = useMetrics();

  return (
    <div>
      <div style={headerSectionStyles}>
        <div>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Dashboard de Observabilidad</h2>
          <p style={{ color: 'var(--muted)' }}>Monitoreo en tiempo real de microservicios mediante Logging Proxy</p>
        </div>
        <button 
          onClick={simulateLoad} 
          disabled={loading}
          style={{
            ...buttonStyles,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Simulando...' : 'Simular Carga'}
        </button>
      </div>

      <div style={cardsGridStyles}>
        {Object.entries(metrics).map(([name, data]) => (
          <ServiceCard 
            key={name}
            name={name}
            totalCalls={data.totalCalls}
            successRate={data.successRate}
            avgTime={data.avgResponseTime}
            isHighError={data.isHighError}
          />
        ))}
      </div>

      <MetricsChart logs={logs} />
      
      <LogTable logs={logs} />

      <footer style={footerStyles}>
        <p>© 2026 - Taller de Patrones de Software - Universidad Cooperativa de Colombia</p>
      </footer>
    </div>
  );
}

const headerSectionStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '2.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const cardsGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '1.5rem',
};

const buttonStyles: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: 'var(--radius)',
  background: 'var(--primary)',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.875rem',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
};

const footerStyles: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem 0',
  color: 'var(--muted)',
  fontSize: '0.875rem',
  borderTop: '1px solid var(--border)',
};
