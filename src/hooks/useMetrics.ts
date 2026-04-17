'use client';

import { useState, useEffect } from 'react';

// Tipos para métricas (Modelado de datos)
export interface ServiceMetrics {
  totalCalls: number;
  successRate: number;
  avgResponseTime: number;
  isHighError: boolean;
}

export interface LogEntry {
  requestId: string;
  service: string;
  operation: string;
  duration: number;
  status: 'SUCCESS' | 'ERROR';
  timestamp: string;
  params?: any;
  response?: any;
}

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Record<string, ServiceMetrics>>({
    Inventory: { totalCalls: 0, successRate: 100, avgResponseTime: 0, isHighError: false },
    Orders: { totalCalls: 0, successRate: 100, avgResponseTime: 0, isHighError: false },
    Payments: { totalCalls: 0, successRate: 100, avgResponseTime: 0, isHighError: false },
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Fetch de datos (Conexión al backend)
  const fetchData = async () => {
    try {
      // Endpoint: /api/metrics/summary
      const summaryRes = await fetch(`${API_URL}/api/metrics/summary`);
      const summaryData = await summaryRes.json();
      
      // Mapeo de métricas (Adaptación al formato del backend)
      const updatedMetrics: any = {};
      const serviceData = summaryData.serviceMetrics || {};
      
      // Iteramos sobre el mapa de servicios (inventory, orders, payments)
      Object.keys(serviceData).forEach((key) => {
        const s = serviceData[key];
        // Capitalizamos la primera letra para que coincida con el estado inicial del front
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        
        updatedMetrics[capitalizedKey] = {
          totalCalls: s.totalCalls,
          successRate: 100 - (s.errorRate || 0), // Convertimos errorRate a successRate
          avgResponseTime: Math.round(s.avgResponseTime || 0),
          isHighError: (s.errorRate || 0) > 15
        };
      });

      // Si el servicio no vino en el backend, mantenemos los valores por defecto
      const finalMetrics = { ...metrics, ...updatedMetrics };
      setMetrics(finalMetrics);

      // Endpoint: /api/metrics/logs
      const logsRes = await fetch(`${API_URL}/api/metrics/logs`);
      const logsData = await logsRes.json();
      
      // Formateamos los logs para el front
      const formattedLogs = logsData.map((l: any) => ({
        requestId: l.requestId,
        service: l.serviceId.charAt(0).toUpperCase() + l.serviceId.slice(1),
        operation: l.operation,
        duration: l.durationMs,
        status: l.status,
        timestamp: l.timestamp,
        params: l.inputParams,
        response: l.result || l.errorMessage
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error("Error al cargar datos", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const simulateLoad = async () => {
    setLoading(true);
    try {
      await fetch(`${API_URL}/api/metrics/simulate-load`, { method: 'POST' });
      await fetchData();
    } catch (error) {
      console.error("Error en simulación", error);
    } finally {
      setLoading(false);
    }
  };

  return { metrics, logs, simulateLoad, loading };
};
