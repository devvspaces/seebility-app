import { extendTheme, type ThemeConfig } from "@chakra-ui/react";


const config : ThemeConfig = {
  useSystemColorMode: false,
  initialColorMode: 'light',
};

export const theme = extendTheme({
  fonts: {
    heading: 'var(--font-main)',
    body: 'var(--font-main)',
  },
  config,
  colors: {
    brand: {
      100: "#EFF7FD",
      200: "#66C2FF",
      300: "#0970B5",
    }
  }
});
