import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { HistoryItem } from '../types';
import { nowISO, copy } from '../utils';

interface GenerateTabProps {
    addToHistory: (item: HistoryItem) => void;
}

export default function GenerateTab({ addToHistory }: GenerateTabProps) {
    const [mode, setMode] = useState("url");
    const [fields, setFields] = useState({
        text: "", url: "", ssid: "", encryption: "WPA", password: "", hidden: false,
        fullName: "", org: "", tel: "", email: "", website: "",
        mailTo: "", mailSub: "", mailBody: "",
        smsType: "sms", smsNum: "", smsMsg: "", lat: "", lng: ""
    });

    const [size, setSize] = useState(320);
    const [margin, setMargin] = useState(2);
    const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("M");
    const [fg, setFg] = useState("#000000");
    const [bg, setBg] = useState("#FFFFFF");
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [payload, setPayload] = useState("");

    useEffect(() => {
        let newPayload = "";

        if (mode === "text") newPayload = fields.text;
        else if (mode === "url") newPayload = fields.url;
        else if (mode === "wifi") newPayload = `WIFI:S:${fields.ssid};T:${fields.encryption};P:${fields.password};H:${fields.hidden};;`;
        else if (mode === "vcard") newPayload = `BEGIN:VCARD\nVERSION:3.0\nN:${fields.fullName}\nORG:${fields.org}\nTEL:${fields.tel}\nEMAIL:${fields.email}\nURL:${fields.website}\nEND:VCARD`;
        else if (mode === "email") newPayload = `mailto:${fields.mailTo}?subject=${encodeURIComponent(fields.mailSub)}&body=${encodeURIComponent(fields.mailBody)}`;
        else if (mode === "sms") {
            if (fields.smsType === "whatsapp") {
                const num = (fields.smsNum || "").replace(/[^\d]/g, "");
                const text = encodeURIComponent(fields.smsMsg || "");
                newPayload = num ? `https://wa.me/${num}?text=${text}` : "";
            } else {
                newPayload = `smsto:${fields.smsNum}:${fields.smsMsg}`;
            }
        }
        else if (mode === "location") newPayload = `geo:${fields.lat},${fields.lng}`;

        setPayload(newPayload);
    }, [mode, fields]);

    function onSaveGenerated() {
        if (!payload) return;

        addToHistory({
            id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
            kind: "generated",
            createdAt: nowISO(),
            meta: { mode },
            value: payload,
        });
    }

    function downloadPNG() {
        if (!payload) return;
        const svg = document.getElementById("qr-svg-export");
        if (!svg) return;

        const marginPx = margin * 4;
        const totalSize = size + (marginPx * 2);

        const canvas = document.createElement("canvas");
        canvas.width = totalSize;
        canvas.height = totalSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drawSVG = () => {
            const xml = new XMLSerializer().serializeToString(svg);
            const svg64 = btoa(unescape(encodeURIComponent(xml)));
            const image64 = 'data:image/svg+xml;base64,' + svg64;
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, marginPx, marginPx, size, size);
                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/png");
                a.download = `qr-${Date.now()}.png`;
                a.click();
            };
            img.src = image64;
        };

        if (bgImage) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.drawImage(img, 0, 0, totalSize, totalSize);
                drawSVG();
            };
            img.src = bgImage;
        } else {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, totalSize, totalSize);
            drawSVG();
        }
    }

    function downloadSVG() {
        if (!payload) return;
        const svgEl = document.getElementById("qr-svg-export");
        if (!svgEl) return;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgEl);

        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${Date.now()}.svg`;
        link.click();
    }

    return (
        <div className="grid">
            <div className="card">
                <h2>Contenido del QR</h2>

                <div className="form-group">
                    <label>Tipo</label>
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="url">URL / Link</option>
                        <option value="text">Texto libre</option>
                        <option value="wifi">Wi-Fi</option>
                        <option value="vcard">Contacto (vCard)</option>
                        <option value="email">Email</option>
                        <option value="sms">SMS / WhatsApp</option>
                        <option value="location">Ubicación</option>
                    </select>
                </div>

                {mode === "text" && (
                    <div className="form-group">
                        <label>Texto</label>
                        <textarea value={fields.text} onChange={(e) => setFields((s) => ({ ...s, text: e.target.value }))} placeholder="Escribe algo..." />
                    </div>
                )}

                {mode === "url" && (
                    <div className="form-group">
                        <label>URL</label>
                        <input value={fields.url} onChange={(e) => setFields((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." />
                    </div>
                )}

                {mode === "wifi" && (
                    <>
                        <div className="row">
                            <div className="form-group">
                                <label>SSID (Red)</label>
                                <input value={fields.ssid} onChange={(e) => setFields((s) => ({ ...s, ssid: e.target.value }))} placeholder="MiWiFi" />
                            </div>
                            <div className="form-group">
                                <label>Seguridad</label>
                                <select value={fields.encryption} onChange={(e) => setFields((s) => ({ ...s, encryption: e.target.value }))}>
                                    <option value="WPA">WPA/WPA2</option>
                                    <option value="WEP">WEP</option>
                                    <option value="nopass">Sin clave</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Contraseña</label>
                            <input value={fields.password} onChange={(e) => setFields((s) => ({ ...s, password: e.target.value }))} placeholder="********" />
                        </div>

                        <label className="checkbox-label">
                            <input type="checkbox" checked={fields.hidden} onChange={(e) => setFields((s) => ({ ...s, hidden: e.target.checked }))} /> Red oculta
                        </label>
                    </>
                )}

                {mode === "vcard" && (
                    <>
                        <div className="row">
                            <div className="form-group"><label>Nombre</label><input value={fields.fullName} onChange={(e) => setFields((s) => ({ ...s, fullName: e.target.value }))} /></div>
                            <div className="form-group"><label>Empresa</label><input value={fields.org} onChange={(e) => setFields((s) => ({ ...s, org: e.target.value }))} /></div>
                        </div>

                        <div className="row">
                            <div className="form-group"><label>Teléfono</label><input value={fields.tel} onChange={(e) => setFields((s) => ({ ...s, tel: e.target.value }))} /></div>
                            <div className="form-group"><label>Email</label><input value={fields.email} onChange={(e) => setFields((s) => ({ ...s, email: e.target.value }))} /></div>
                        </div>

                        <div className="form-group"><label>Sitio web</label><input value={fields.website} onChange={(e) => setFields((s) => ({ ...s, website: e.target.value }))} /></div>
                    </>
                )}

                {mode === "email" && (
                    <>
                        <div className="form-group"><label>Destinatario</label><input value={fields.mailTo} onChange={(e) => setFields((s) => ({ ...s, mailTo: e.target.value }))} placeholder="correo@ejemplo.com" /></div>
                        <div className="form-group"><label>Asunto</label><input value={fields.mailSub} onChange={(e) => setFields((s) => ({ ...s, mailSub: e.target.value }))} /></div>
                        <div className="form-group"><label>Mensaje</label><textarea value={fields.mailBody} onChange={(e) => setFields((s) => ({ ...s, mailBody: e.target.value }))} /></div>
                    </>
                )}

                {mode === "sms" && (
                    <>
                        <div className="row">
                            <div className="form-group">
                                <label>Canal</label>
                                <select value={fields.smsType} onChange={(e) => setFields((s) => ({ ...s, smsType: e.target.value }))}>
                                    <option value="sms">SMS</option>
                                    <option value="whatsapp">WhatsApp</option>
                                </select>
                            </div>
                            <div className="form-group"><label>Número</label><input value={fields.smsNum} onChange={(e) => setFields((s) => ({ ...s, smsNum: e.target.value }))} placeholder="+123456789" /></div>
                        </div>

                        <div className="form-group"><label>Mensaje</label><textarea value={fields.smsMsg} onChange={(e) => setFields((s) => ({ ...s, smsMsg: e.target.value }))} /></div>
                    </>
                )}

                {mode === "location" && (
                    <div className="row">
                        <div className="form-group"><label>Latitud</label><input value={fields.lat} onChange={(e) => setFields((s) => ({ ...s, lat: e.target.value }))} placeholder="4.60971" /></div>
                        <div className="form-group"><label>Longitud</label><input value={fields.lng} onChange={(e) => setFields((s) => ({ ...s, lng: e.target.value }))} placeholder="-74.08175" /></div>
                    </div>
                )}

                <hr className="divider" />

                <h2>Personalización Visual</h2>

                <div className="row">
                    <div className="form-group">
                        <label>Tamaño (px)</label>
                        <input type="number" min="160" max="2000" value={size} onChange={(e) => setSize(Number(e.target.value || 320))} />
                        <div className="hint">Este tamaño se refleja en la vista previa y en la exportación.</div>
                    </div>

                    <div className="form-group">
                        <label>Margen</label>
                        <input type="number" min="0" max="10" value={margin} onChange={(e) => setMargin(Number(e.target.value || 2))} />
                    </div>

                    <div className="form-group">
                        <label>Nivel de Error</label>
                        <select value={ecc} onChange={(e) => setEcc(e.target.value as "L" | "M" | "Q" | "H")}>
                            <option value="L">Baja</option>
                            <option value="M">Media</option>
                            <option value="Q">Alta</option>
                            <option value="H">Máxima</option>
                        </select>
                        <div className="hint">Más corrección = más tolerancia al daño, pero menos capacidad.</div>
                    </div>
                </div>

                <div className="row">
                    <div className="form-group">
                        <label>Colores</label>
                        <div className="row" style={{ gap: '8px' }}>
                            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} title="Color principal" style={{ padding: 0, height: '36px' }} />
                            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} title="Color de fondo" style={{ padding: 0, height: '36px' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Imagen de Fondo</label>
                        <div className="btns">
                            <label htmlFor="bg-image-upload" className="button secondary cursor-pointer">Subir imagen</label>
                            <input
                                id="bg-image-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => setBgImage(event.target?.result as string);
                                        reader.readAsDataURL(file);
                                    }
                                    e.target.value = '';
                                }}
                            />
                            {bgImage && <button type="button" className="danger" onClick={() => setBgImage(null)}>Quitar</button>}
                        </div>
                        <div className="hint">Tip: imagen clara + buen contraste para mantener escaneabilidad.</div>
                    </div>
                </div>

                <div className="btns" style={{ marginTop: 24 }}>
                    <button className="primary" onClick={onSaveGenerated} disabled={!payload}>Guardar en historial</button>
                    <button className="secondary" onClick={downloadPNG} disabled={!payload}>Descargar PNG</button>
                    <button className="secondary" onClick={downloadSVG} disabled={!payload}>Descargar SVG</button>
                    <button className="secondary" onClick={() => copy(payload)} disabled={!payload}>Copiar Contenido</button>
                </div>

                <div className="hint" style={{ marginTop: 16 }}>
                    <div className="mono" style={{ wordBreak: 'break-all' }}>
                        {payload ? payload.slice(0, 200) + (payload.length > 200 ? "…" : "") : "Esperando contenido..."}
                    </div>
                </div>
            </div>

            <div className="card">
                <h2>Vista Previa</h2>

                <div className="preview-container">
                    <div style={{
                        backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: bgImage ? 'transparent' : bg,
                        padding: `${margin * 4}px`,
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        display: 'inline-block'
                    }}>
                        {payload ? (
                            <QRCodeSVG
                                id="qr-svg-export"
                                value={payload}
                                size={size}
                                level={ecc}
                                bgColor={bgImage ? "transparent" : bg}
                                fgColor={fg}
                                style={{ display: 'block' }}
                            />
                        ) : (
                            <div style={{ width: 250, height: 250, border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Vacío</div>
                        )}
                    </div>
                </div>

                <div className="hint" style={{ marginTop: 12 }}>
                    Si el QR es grande, puedes desplazarte dentro de la vista previa.
                </div>
            </div>
        </div>
    );
}