'use client';

interface Props {
  name: string;
  totalCalls: number;
  successRate: number;
  avgTime: number;
  isHighError: boolean;
}

export default function ServiceCard({ name, totalCalls, successRate, avgTime, isHighError }: Props) {
  // Alerta de error (Validación visual crítica)
  const cardStyle: React.CSSProperties = {
    background: 'var(--card)',
    borderRadius: 'var(--radius)',
    padding: '1.5rem',
    border: isHighError ? '2px solid var(--error)' : '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    transition: 'transform 0.2s ease',
  };

  return (
    <div style={cardStyle}>
      <h3 style={{ marginBottom: '1rem', color: isHighError ? 'var(--error)' : 'var(--primary)' }}>
        {name === 'Inventory' ? 'Inventario' : name === 'Orders' ? 'Pedidos' : 'Pagos'}
      </h3>
      <div style={gridStyles}>
        <div>
          <p style={labelStyles}>Llamadas</p>
          <p style={valueStyles}>{totalCalls}</p>
        </div>
        <div>
          <p style={labelStyles}>Éxito</p>
          <p style={{ ...valueStyles, color: successRate < 85 ? 'var(--error)' : 'var(--success)' }}>
            {successRate.toFixed(1)}%
          </p>
        </div>
        <div>
          <p style={labelStyles}>Promedio</p>
          <p style={valueStyles}>{avgTime.toFixed(0)}ms</p>
        </div>
      </div>
    </div>
  );
}

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
};

const labelStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--muted)',
  textTransform: 'uppercase',
  marginBottom: '0.25rem',
};

const valueStyles: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
};
