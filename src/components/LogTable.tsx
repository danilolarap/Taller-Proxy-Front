'use client';

import { useState } from 'react';
import { LogEntry } from '@/hooks/useMetrics';

interface Props {
  logs: LogEntry[];
}

export default function LogTable({ logs }: Props) {
  const [filterService, setFilterService] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtrado de logs (Lógica filtrado dinámico)
  const filteredLogs = logs.filter(log => {
    const matchService = filterService === 'ALL' || log.service === filterService;
    const matchStatus = filterStatus === 'ALL' || log.status === filterStatus;
    return matchService && matchStatus;
  });

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h3>Registros de Auditoría</h3>
        <div style={filterGroupStyles}>
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} style={selectStyles}>
            <option value="ALL">Todos los Servicios</option>
            <option value="Inventory">Inventario</option>
            <option value="Orders">Pedidos</option>
            <option value="Payments">Pagos</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={selectStyles}>
            <option value="ALL">Todos los Estados</option>
            <option value="SUCCESS">Éxito</option>
            <option value="ERROR">Error</option>
          </select>
        </div>
      </div>

      <div style={tableWrapperStyles}>
        <table style={tableStyles}>
          <thead>
            <tr style={rowStyles}>
              <th style={thStyles}>ID Petición</th>
              <th style={thStyles}>Servicio</th>
              <th style={thStyles}>Operación</th>
              <th style={thStyles}>Duración</th>
              <th style={thStyles}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <React.Fragment key={log.requestId}>
                <tr 
                  onClick={() => setExpandedId(expandedId === log.requestId ? null : log.requestId)}
                  style={{ ...rowStyles, cursor: 'pointer' }}
                >
                  <td style={tdStyles}>{log.requestId.substring(0, 8)}...</td>
                  <td style={tdStyles}>{log.service}</td>
                  <td style={tdStyles}>{log.operation}</td>
                  <td style={tdStyles}>{log.duration}ms</td>
                  <td style={tdStyles}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem',
                      background: log.status === 'SUCCESS' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: log.status === 'SUCCESS' ? 'var(--success)' : 'var(--error)',
                      fontWeight: 600
                    }}>
                      {log.status === 'SUCCESS' ? 'ÉXITO' : 'ERROR'}
                    </span>
                  </td>
                </tr>
                {expandedId === log.requestId && (
                  <tr>
                    <td colSpan={5} style={detailStyles}>
                      <div style={detailContentStyles}>
                        <p><strong>Timestamp:</strong> {new Date(log.timestamp).toLocaleString()}</p>
                        <p><strong>Parámetros:</strong> {JSON.stringify(log.params || {}, null, 2)}</p>
                        <p><strong>Respuesta:</strong> {JSON.stringify(log.response || {}, null, 2)}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';

const containerStyles: React.CSSProperties = {
  background: 'var(--card)',
  borderRadius: 'var(--radius)',
  padding: '1.5rem',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow)',
  marginTop: '2rem',
  marginBottom: '4rem',
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '1rem',
};

const filterGroupStyles: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const selectStyles: React.CSSProperties = {
  padding: '0.5rem',
  borderRadius: 'var(--radius)',
  border: '1px solid var(--border)',
  background: 'var(--background)',
  color: 'var(--foreground)',
};

const tableWrapperStyles: React.CSSProperties = {
  overflowX: 'auto',
};

const tableStyles: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
};

const rowStyles: React.CSSProperties = {
  borderBottom: '1px solid var(--border)',
};

const thStyles: React.CSSProperties = {
  textAlign: 'left',
  padding: '1rem',
  color: 'var(--muted)',
  fontSize: '0.875rem',
  fontWeight: 600,
};

const tdStyles: React.CSSProperties = {
  padding: '1rem',
  fontSize: '0.875rem',
};

const detailStyles: React.CSSProperties = {
  padding: '1rem',
  background: 'var(--secondary)',
};

const detailContentStyles: React.CSSProperties = {
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  whiteSpace: 'pre-wrap',
  color: 'var(--secondary-foreground)',
};
