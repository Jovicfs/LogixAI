// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2563eb', // Azul vibrante, usado no botão "Gerar Post"
        },
        secondary: {
            main: '#1e40af', // Azul escuro, para contraste
        },
        background: {
            default: '#f9fafb', // Cor de fundo da página
            paper: '#ffffff',   // Fundo dos cards
        },
        text: {
            primary: '#1f2937',  // Quase preto, boa legibilidade
            secondary: '#4b5563' // Cinza médio, usado no texto do post
        },
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
