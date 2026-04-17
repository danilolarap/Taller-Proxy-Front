'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { LogEntry } from '@/hooks/useMetrics';

interface Props {
  logs: LogEntry[];
}

export default function MetricsChart({ logs }: Props) {
  // Procesar datos gráfica (Transformación datos gráfica)
  const data = logs.slice(0, 20).reverse().map((log, index) => ({
    name: index,
    duration: log.duration,
    service: log.service === 'Inventory' ? 'Inventario' : log.service === 'Orders' ? 'Pedidos' : 'Pagos',
    status: log.status
  }));

  return (
    <div style={containerStyles}>
      <h3 style={{ marginBottom: '1.5rem' }}>Tiempos de Respuesta (Últimas 20 llamadas)</h3>
      <div style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" hide />
            <YAxis stroke="var(--muted)" fontSize={12} tickFormatter={(val) => `${val}ms`} />
            <Tooltip 
              contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
              itemStyle={{ color: 'var(--primary)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="duration" 
              name="Duración (ms)"
              stroke="var(--primary)" 
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--primary)' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const containerStyles: React.CSSProperties = {
  background: 'var(--card)',
  borderRadius: 'var(--radius)',
  padding: '1.5rem',
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow)',
  marginTop: '2rem',
};
