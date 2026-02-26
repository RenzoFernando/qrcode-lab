import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import type { HistoryItem } from '../types';
import { classifyResult, nowISO, copy } from '../utils';
import FileDropZone from './FileDropZone';

interface ScanTabProps {
    addToHistory: (item: HistoryItem) => void;
}

export default function ScanTab({ addToHistory }: ScanTabProps) {
    const [scanStatus, setScanStatus] = useState("stopped");
    const [scanError, setScanError] = useState("");
    const [scanResult, setScanResult] = useState("");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanRegionId = "reader";
    const fileScanRegionId = "file-reader";

    async function startScan() {
        setScanError("");
        setScanResult("");

        try {
            const inst = new Html5Qrcode(scanRegionId);
            scannerRef.current = inst;
            setScanStatus("running");

            await inst.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    setScanResult(decodedText);
                    addToHistory({
                        id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
                        kind: "scanned",
                        createdAt: nowISO(),
                        meta: { from: "camera" },
                        value: decodedText,
                    });
                    await stopScan();
                },
                () => {}
            );
        } catch (e) {
            setScanStatus("error");
            setScanError("Error de cámara. Revisa permisos o usa HTTPS.");
            await stopScan();
        }
    }

    async function stopScan() {
        try {
            const inst = scannerRef.current;
            if (!inst) {
                setScanStatus("stopped");
                return;
            }
            if (inst.isScanning) {
                await inst.stop().catch(() => {});
            }
            inst.clear();
        } catch {
        } finally {
            scannerRef.current = null;
            setScanStatus("stopped");
        }
    }

    useEffect(() => {
        return () => {
            stopScan();
        };
    }, []);

    async function scanFromImage(file: File) {
        setScanError("");
        setScanResult("");

        try {
            const inst = new Html5Qrcode(fileScanRegionId);
            const decodedText = await inst.scanFile(file, true);
            setScanResult(decodedText);
            addToHistory({
                id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
                kind: "scanned",
                createdAt: nowISO(),
                meta: { from: "image" },
                value: decodedText,
            });
            inst.clear();
        } catch (e) {
            setScanError("No se pudo leer el QR en la imagen. Intenta con una foto más nítida.");
        }
    }

    const scanInfo = useMemo(() => classifyResult(scanResult), [scanResult]);

    return (
        <div className="grid">
            <div className="card">
                <h2>Escanear con cámara</h2>

                <div id={scanRegionId} className="scanner-view" />
                <div id={fileScanRegionId} style={{ display: 'none' }} />

                <div className="btns" style={{ marginTop: 16 }}>
                    <button className="primary" onClick={startScan} disabled={scanStatus === "running"}>Iniciar cámara</button>
                    <button className="secondary" onClick={stopScan} disabled={scanStatus !== "running"}>Detener</button>
                </div>

                {scanError && <div className="hint error">{scanError}</div>}

                <hr className="divider" />

                <h2>Leer desde imagen</h2>
                <FileDropZone
                    accept="image/*"
                    label="Arrastra y suelta una imagen aquí"
                    helperText="Formatos: JPG, PNG, WEBP. Tip: buena luz, sin blur."
                    buttonText="Seleccionar imagen"
                    onFile={scanFromImage}
                />
            </div>

            <div className="card">
                <h2>Resultado</h2>

                <div className="result-container">
                    {scanResult ? (
                        <div style={{ width: "100%" }}>
                            <div className="itemTop">
                                <span className="badge">{scanInfo.type}</span>
                                <span className="mono text-small">{new Date().toLocaleString()}</span>
                            </div>

                            <div className="itemBody mono">
                                {scanResult}
                            </div>

                            <div className="btns" style={{ marginTop: 16 }}>
                                {scanInfo.action === "open" ? (
                                    <button className="primary" onClick={() => window.open(scanResult, "_blank")}>Abrir link / Acción</button>
                                ) : (
                                    <button className="primary" onClick={() => copy(scanResult)}>Copiar texto</button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="hint">Esperando lectura...</div>
                    )}
                </div>
            </div>
        </div>
    );
}