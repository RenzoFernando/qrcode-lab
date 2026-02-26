export interface HistoryItem {
    id: string;
    kind: "generated" | "scanned";
    createdAt: string;
    meta: any;
    value: string;
}