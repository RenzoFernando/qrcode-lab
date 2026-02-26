
# QR Code Lab 

Aplicación web **100% frontend** para **generar** y **escanear** códigos QR, hecha con **React + TypeScript + Vite**. Pensada para desplegarse en **GitHub Pages**, sin backend (todo el historial se guarda localmente en el navegador).

## Funciones principales
- Generación de QR (URL, texto, Wi-Fi, vCard, email, SMS/WhatsApp, ubicación)
- Personalización visual (tamaño, margen, nivel de corrección, colores, fondo con imagen)
- Escaneo con cámara (HTML5)
- Escaneo desde imagen (drag & drop / selector)
- Historial local (exportar/importar JSON)
- Temas visuales (claro/oscuro y presets)
- Modo privado (no guarda historial)

## Requisitos
- Node.js 18+ recomendado

## Instalar y ejecutar
```bash
npm install
npm run dev
````

## Build

```bash
npm run build
npm run preview
```

## Notas

* El historial se guarda en `localStorage`.
* Si borras datos del navegador, se puede perder el historial (usa Exportar JSON para respaldo).

---

© Todos los derechos reservados.

