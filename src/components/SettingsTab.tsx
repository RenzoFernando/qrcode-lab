import React from 'react';

interface SettingsTabProps {
    theme: string;
    setTheme: (t: string) => void;
    privateMode: boolean;
    setPrivateMode: (v: boolean) => void;
}

export default function SettingsTab({ theme, setTheme, privateMode, setPrivateMode }: SettingsTabProps) {
    return (
        <div className="card">
            <h2>Ajustes de la Aplicación</h2>

            <div className="row">
                <div className="form-group">
                    <label>Tema Visual</label>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                        <option value="dark">Oscuro</option>
                        <option value="light">Claro</option>
                        <option value="gray">Gris (Minimalista)</option>
                        <option value="colorful">Multicolor (Vibrante)</option>
                        <option value="playful">Infantil (Divertido)</option>
                        <option value="corporate">Empresarial (Elegante)</option>
                        <option value="high-contrast">Alto Contraste</option>
                    </select>
                    <div className="hint">La app funciona localmente. No hay backend.</div>
                </div>
            </div>

            <hr className="divider" />

            <h2>Privacidad</h2>
            <label className="checkbox-label">
                <input type="checkbox" checked={privateMode} onChange={(e) => setPrivateMode(e.target.checked)} />
                Modo privado: no guardar historial
            </label>
            <div className="hint">Cuando está activado, el botón “Guardar” y el guardado automático desde escaneo no persistirán en el historial.</div>
        </div>
    );
}