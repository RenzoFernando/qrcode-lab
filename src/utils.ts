export function nowISO() {
    return new Date().toISOString();
}

export function classifyResult(text: string) {
    if (!text) return { type: "Desconocido", action: "none" };
    const lower = text.toLowerCase();
    if (lower.startsWith("http://") || lower.startsWith("https://")) return { type: "URL", action: "open" };
    if (lower.startsWith("wifi:")) return { type: "WiFi", action: "copy" };
    if (lower.startsWith("begin:vcard")) return { type: "vCard", action: "copy" };
    if (lower.startsWith("mailto:")) return { type: "Email", action: "open" };
    if (lower.startsWith("smsto:") || lower.startsWith("sms:")) return { type: "SMS", action: "open" };
    if (lower.startsWith("geo:")) return { type: "Ubicación", action: "open" };
    if (lower.startsWith("tel:")) return { type: "Teléfono", action: "open" };
    return { type: "Texto", action: "copy" };
}

export function copy(text: string) {
    navigator.clipboard.writeText(text || "");
}