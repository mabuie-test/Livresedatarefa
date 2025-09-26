import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import AppRouter from './pages/AppRouter.jsx';
import theme from './theme.js';
import './assets/logo.svg';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
