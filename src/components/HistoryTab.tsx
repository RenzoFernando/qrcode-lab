import React from 'react';
import type { HistoryItem } from '../types';
import { classifyResult, copy } from '../utils';

interface HistoryTabProps {
    history: HistoryItem[];
    saveHistory: (h: HistoryItem[]) => void;
    notify: (msg: string) => void;
    privateMode: boolean;
}

export default function HistoryTab({ history, saveHistory, notify, privateMode }: HistoryTabProps) {
    function clearHistory() {
        if (window.confirm("¿Seguro que deseas borrar todo el historial?")) {
            saveHistory([]);
            notify("Historial limpiado.");
        }
    }

    function exportHistoryJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
        const link = document.createElement("a");
        link.href = dataStr;
        link.download = "qr-history.json";
        link.click();
        notify("Historial exportado: qr-history.json");
    }

    function importHistoryJSON(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (Array.isArray(imported)) {
                    saveHistory(imported);
                    notify("Historial importado con éxito.");
                } else {
                    notify("El JSON no tiene el formato esperado.");
                }
            } catch (err) {
                notify("Archivo JSON no válido.");
            }
        };

        reader.readAsText(file);
        e.target.value = '';
    }

    return (
        <div className="card">
            <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <h2 style={{ marginBottom: 0 }}>Biblioteca e Historial</h2>
                    <div className="hint" style={{ marginTop: 0 }}>Guardado local (sin backend). Exporta JSON como respaldo.</div>
                </div>

                <div className="btns">
                    <button className="secondary" onClick={exportHistoryJSON} disabled={history.length === 0}>Exportar JSON</button>

                    <label className="button secondary cursor-pointer">
                        Importar JSON
                        <input type="file" accept=".json" style={{ display: 'none' }} onChange={importHistoryJSON} />
                    </label>

                    <button className="danger" onClick={clearHistory} disabled={history.length === 0}>Limpiar Todo</button>
                </div>
            </div>

            <hr className="divider" />

            {privateMode && (
                <div className="alert-banner info">
                    Modo privado activo: los QRs nuevos no se guardan en el historial.
                </div>
            )}

            {history.length >= 15 && (
                <div className="alert-banner warning">
                    Tienes {history.length} códigos guardados. Recuerda exportar tu historial para no perderlo si limpias el navegador.
                </div>
            )}

            {history.length === 0 ? (
                <div className="hint">No hay QRs guardados en el historial local.</div>
            ) : (
                <div className="list">
                    {history.map((h) => {
                        const info = classifyResult(h.value);
                        return (
                            <div className="item-history" key={h.id}>
                                <div className="itemTop">
                                    <span className="badge">
                                        {h.kind === "generated" ? "Generado" : "Escaneado"} · {info.type}
                                    </span>
                                    <span className="mono text-small">{new Date(h.createdAt).toLocaleString()}</span>
                                </div>

                                <div className="itemBody mono">
                                    {h.value.slice(0, 150)}{h.value.length > 150 ? "…" : ""}
                                </div>

                                <div className="btns" style={{ marginTop: 8 }}>
                                    <button className="secondary small" onClick={() => copy(h.value)}>Copiar</button>
                                    {info.action === "open" && (
                                        <button className="secondary small" onClick={() => window.open(h.value.trim(), "_blank")}>Abrir</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}