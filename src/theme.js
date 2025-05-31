// src/theme.js
import { createTheme } from '@mui/material/styles';

const getTheme = (darkMode) => createTheme({
    palette: {
        mode: darkMode ? 'dark' : 'light',
        ...(darkMode
            ? {
                background: {
                    default: '#18181b',
                    paper: '#23232a'
                },
                text: {
                    primary: '#f3f4f6',
                    secondary: '#a1a1aa'
                },
                primary: { main: '#3b82f6' },
                secondary: { main: '#6366f1' }
            }
            : {
                background: {
                    default: '#f3f4f6',
                    paper: '#fff'
                },
                text: {
                    primary: '#18181b',
                    secondary: '#52525b'
                },
                primary: { main: '#2563eb' },
                secondary: { main: '#6366f1' }
            })
    },
    typography: {
        fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,
        h4: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        body1: { fontSize: '1rem' },
    },
    shape: { borderRadius: 12 },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 10,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: { borderRadius: 16 },
            },
        },
    },
});

export default getTheme;
