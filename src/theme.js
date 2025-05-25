// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb', // Azul vibrante
            light: '#60a5fa', // Azul claro
            dark: '#1e3a8a', // Azul escuro
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#1e40af', // Azul escuro
            light: '#818cf8', // Azul lavanda
            dark: '#1e293b', // Azul quase preto
            contrastText: '#ffffff',
        },
        success: {
            main: '#22c55e', // Verde
            light: '#bbf7d0',
            dark: '#15803d',
            contrastText: '#ffffff',
        },
        error: {
            main: '#ef4444', // Vermelho
            light: '#fecaca',
            dark: '#991b1b',
            contrastText: '#ffffff',
        },
        warning: {
            main: '#f59e42', // Laranja
            light: '#fde68a',
            dark: '#b45309',
            contrastText: '#1f2937',
        },
        info: {
            main: '#0ea5e9', // Azul claro
            light: '#bae6fd',
            dark: '#0369a1',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f3f4f6', // Cinza muito claro
            paper: '#ffffff',
        },
        text: {
            primary: '#1f2937',  // Quase preto
            secondary: '#4b5563', // Cinza médio
            disabled: '#9ca3af',  // Cinza claro
        },
        divider: '#e5e7eb', // Cinza para divisores
    },
    typography: {
        fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
        h4: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
    shape: {
        borderRadius: 12, // Canto levemente arredondado
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Evita letras maiúsculas
                    borderRadius: 10,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                },
            },
        },
    },
});

export default theme;
