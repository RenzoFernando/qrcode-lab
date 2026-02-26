import React from 'react';

interface TabBarProps {
    tab: string;
    setTab: (tab: string) => void;
}

const tabs = [
    {
        id: "generate",
        label: "Generar",
        icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                <path d="M11 7h2v10h-2z" />
                <path d="M7 11h10v2H7z" />
            </svg>
        )
    },
    {
        id: "scan",
        label: "Escanear",
        icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M20 5h-3.2l-1.8-2H9L7.2 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12z" />
                <path d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
            </svg>
        )
    },
    {
        id: "history",
        label: "Historial",
        icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm0 18a8 8 0 118-8 8.009 8.009 0 01-8 8z" />
                <path d="M13 7h-2v6l5.25 3.15 1-1.65-4.25-2.5z" />
            </svg>
        )
    },
    {
        id: "settings",
        label: "Ajustes",
        icon: (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.027 7.027 0 00-1.63-.94l-.36-2.54A.5.5 0 0013.9 1h-3.8a.5.5 0 00-.49.42l-.36 2.54c-.58.22-1.12.52-1.63.94l-2.39-.96a.5.5 0 00-.6.22L2.71 7.48a.5.5 0 00.12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32c.13.23.39.32.6.22l2.39-.96c.5.41 1.05.72 1.63.94l.36 2.54c.04.24.25.42.49.42h3.8c.24 0 .45-.18.49-.42l.36-2.54c.58-.22 1.12-.52 1.63-.94l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1115.5 12 3.504 3.504 0 0112 15.5z" />
            </svg>
        )
    }
] as const;

export default function TabBar({ tab, setTab }: TabBarProps) {
    return (
        <nav className="tabs" role="tablist" aria-label="Navegación">
            {tabs.map((t) => (
                <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.id}
                    className={`tab ${tab === t.id ? "active" : ""}`}
                    onClick={() => setTab(t.id)}
                >
                    <span className="tab-icon">{t.icon}</span>
                    <span className="tab-label">{t.label}</span>
                </button>
            ))}
        </nav>
    );
}