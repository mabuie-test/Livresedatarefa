import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const colors = {
  brand: {
    50: '#f8f5ff',
    100: '#efe7ff',
    500: '#6D28D9', // primary
    700: '#4c0dbf'
  },
  accent: {
    500: '#F59E0B'
  }
};

const theme = extendTheme({ config, colors, fonts: { heading: 'Inter, system-ui, sans-serif', body: 'Inter, system-ui, sans-serif' } });

export default theme;
