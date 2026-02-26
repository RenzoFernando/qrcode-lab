import React from 'react';
import { OWNER_FULL_NAME } from '../config/appConfig';

export default function Footer() {
    return (
        <footer className="footer">
            <p>© {new Date().getFullYear()} Todos los derechos reservados - {OWNER_FULL_NAME}</p>
        </footer>
    );
}