'use client';

import './globals.css';
import { useState, useEffect, createContext, useContext } from 'react';

// Contexto para tema (Configuración global tema)
const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <html lang="es">
      <body className={theme}>
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
          <header style={headerStyles}>
            <div style={containerStyles}>
              <h1 style={logoStyles}>Sistema de monitoreo de microservicios con Proxy de auditoría y logging</h1>
              <button onClick={toggleTheme} style={themeToggleStyles}>
                {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
              </button>
            </div>
          </header>
          <main style={containerStyles}>
            {children}
          </main>
        </ThemeContext.Provider>
      </body>
    </html>
  );
}

export const useTheme = () => useContext(ThemeContext);

const headerStyles: React.CSSProperties = {
  background: 'var(--card)',
  borderBottom: '1px solid var(--border)',
  padding: '1rem 0',
  marginBottom: '2rem',
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

const containerStyles: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1.5rem',
};

const logoStyles: React.CSSProperties = {
  fontSize: '1rem',
  color: 'var(--foreground)',
  fontWeight: 700,
};

const themeToggleStyles: React.CSSProperties = {
  padding: '0.5rem 1rem',
  borderRadius: 'var(--radius)',
  background: 'var(--secondary)',
  color: 'var(--secondary-foreground)',
  fontWeight: 600,
  fontSize: '0.875rem',
  float: 'right',
  marginTop: '-2.2rem',
};
