import React, { useCallback, useId, useState } from 'react';

interface FileDropZoneProps {
    accept?: string;
    label: string;
    helperText?: string;
    buttonText?: string;
    disabled?: boolean;
    onFile: (file: File) => void;
}

export default function FileDropZone({
                                         accept,
                                         label,
                                         helperText,
                                         buttonText = "Seleccionar archivo",
                                         disabled = false,
                                         onFile
                                     }: FileDropZoneProps) {
    const inputId = useId();
    const [isDragging, setIsDragging] = useState(false);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = '';
    }, [onFile]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        setIsDragging(true);
    }, [disabled]);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
    }, [disabled, onFile]);

    return (
        <div
            className={`dropzone ${isDragging ? "dragging" : ""} ${disabled ? "disabled" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <input
                id={inputId}
                type="file"
                accept={accept}
                style={{ display: 'none' }}
                onChange={onChange}
                disabled={disabled}
            />

            <div className="dropzone-inner">
                <div className="dropzone-title">{label}</div>
                {helperText && <div className="hint">{helperText}</div>}

                <div className="btns">
                    <label htmlFor={inputId} className={`button primary cursor-pointer`}>
                        {buttonText}
                    </label>
                </div>
            </div>
        </div>
    );
}