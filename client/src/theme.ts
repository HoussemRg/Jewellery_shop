import { ThemeOptions } from '@mui/material/styles';

// Extend the PaletteColor interface to include custom color keys
declare module '@mui/material/styles' {
  interface PaletteColor {
    0?: string;
    10?: string;
    50?: string;
    100?: string;
    200?: string;
    300?: string;
    400?: string;
    500?: string;
    600?: string;
    700?: string;
    800?: string;
    900?: string;
    1000?: string;
  }
}

interface ColorTokens {
  [key: string]: string;
}

interface TokenPalette {
  grey: ColorTokens;
  mainColor: ColorTokens; 
  accentColor: ColorTokens;
  neutral: ColorTokens;
  green: ColorTokens;
  red: ColorTokens;
}

export const tokensDark: TokenPalette = {
  grey: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#f0f0f0",
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  mainColor: { // Previously 'primary'
    100: "#d3d4de",
    200: "#a6a9be",
    300: "#7a7f9d",
    400: "#4d547d",
    500: "#21295c",
    600: "#191F45",
    700: "#141937",
    800: "#0d1025",
    900: "#070812",
  },
  accentColor: { // Previously 'secondary'
    50: "#f0f0f0",
    100: "#fff6e0",
    200: "#ffedc2",
    300: "#ffe3a3",
    400: "#ffda85",
    500: "#ffd166",
    600: "#cca752",
    700: "#997d3d",
    800: "#665429",
    900: "#332a14",
  },
  neutral: {
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
  },
  green: { // New color category
    50: "#e0f2f1",
    100: "#b9e0dc",
    200: "#80cbc4",
    300: "#4db6ac",
    400: "#26a69a",
    500: "#009688",
    600: "#00897b",
    700: "#00796b",
    800: "#004d40",
    900: "#00251a",
  },
  red: { // New color category
    50: "#ffebee",
    100: "#ffcdd2",
    200: "#ef9a9a",
    300: "#e57373",
    400: "#ef5350",
    500: "#f44336",
    600: "#e53935",
    700: "#d32f2f",
    800: "#c62828",
    900: "#b71c1c",
  },
};

function reverseTokens(tokens: TokenPalette): TokenPalette {
  const reversedTokens: TokenPalette = {
    grey: {},
    mainColor: {},
    accentColor: {},
    neutral: {},
    green: {},
    red: {},
  };

  Object.entries(tokens).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val) as string[];
    const length = keys.length;
    const reversedObj: ColorTokens = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key as keyof TokenPalette] = reversedObj;
  });

  return reversedTokens;
}

export const tokensLight = reverseTokens(tokensDark);

export const themeSettings = (mode: 'light' | 'dark'): ThemeOptions => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.mainColor,
              main: tokensDark.mainColor[400],
              light: tokensDark.mainColor[400],
            },
            secondary: {
              ...tokensDark.accentColor,
              main: tokensDark.accentColor[300],
            },
            neutral: {
              ...tokensDark.neutral,
              main: tokensDark.neutral[500],
            },
            background: {
              default: tokensDark.mainColor[600],
              paper: tokensDark.mainColor[500],
            },
            green: {
              ...tokensDark.green,
              main: tokensDark.green[500],
            },
            red: {
              ...tokensDark.red,
              main: tokensDark.red[500],
            },
          }
        : {
            mainColor: {
              ...tokensLight.mainColor,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            accentColor: {
              ...tokensLight.accentColor,
              main: tokensDark.accentColor[600],
              light: tokensDark.accentColor[700],
            },
            neutral: {
              ...tokensLight.neutral,
              main: tokensDark.grey[500],
            },
            background: {
              default: tokensDark.grey[0],
              paper: tokensDark.grey[50],
            },
            green: {
              ...tokensLight.green,
              main: tokensDark.green[500],
            },
            red: {
              ...tokensLight.red,
              main: tokensDark.red[500],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
