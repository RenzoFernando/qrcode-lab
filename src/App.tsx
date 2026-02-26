import React, { useState, useEffect, useRef } from 'react';
import type { HistoryItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GenerateTab from './components/GenerateTab';
import ScanTab from './components/ScanTab';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
    const [tab, setTab] = useState("generate");
    const [theme, setTheme] = useState("dark");
    const [privateMode, setPrivateMode] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [toast, setToast] = useState("");
    const toastTimerRef = useRef<number | null>(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        const saved = localStorage.getItem("qr_history");
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                setHistory([]);
            }
        }

        const savedTheme = localStorage.getItem("qr_theme");
        if (savedTheme) setTheme(savedTheme);

        const savedPrivate = localStorage.getItem("qr_private_mode");
        if (savedPrivate === "1") setPrivateMode(true);
    }, []);

    function saveHistory(newHistory: HistoryItem[]) {
        setHistory(newHistory);
        localStorage.setItem("qr_history", JSON.stringify(newHistory));
    }

    function addToHistory(item: HistoryItem) {
        if (privateMode) {
            showToast("Modo privado activo: no se guardó en el historial.");
            return;
        }

        setHistory((prev) => {
            const newHistory = [item, ...prev];
            localStorage.setItem("qr_history", JSON.stringify(newHistory));
            return newHistory;
        });

        showToast("¡Guardado en el historial con éxito!");
    }

    function showToast(msg: string) {
        setToast(msg);
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = window.setTimeout(() => setToast(""), 3500);
    }

    return (
        <div className="app-wrapper">
            {toast && <div className="toast">{toast}</div>}

            <div className="container">
                <Header tab={tab} setTab={setTab} />

                <main className="main-content">
                    {tab === "generate" && <GenerateTab addToHistory={addToHistory} />}
                    {tab === "scan" && <ScanTab addToHistory={addToHistory} />}

                    {tab === "history" && (
                        <HistoryTab
                            history={history}
                            saveHistory={saveHistory}
                            notify={showToast}
                            privateMode={privateMode}
                        />
                    )}

                    {tab === "settings" && (
                        <SettingsTab
                            theme={theme}
                            setTheme={(t) => {
                                setTheme(t);
                                localStorage.setItem("qr_theme", t);
                            }}
                            privateMode={privateMode}
                            setPrivateMode={(v) => {
                                setPrivateMode(v);
                                localStorage.setItem("qr_private_mode", v ? "1" : "0");
                                showToast(v ? "Modo privado activado." : "Modo privado desactivado.");
                            }}
                        />
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}