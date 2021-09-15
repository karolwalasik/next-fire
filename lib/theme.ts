import { createTheme } from "@material-ui/core/styles";
import { cyan, pink, red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: cyan[500],
      light: '#6ff9ff',
      dark: '#0095a8'
    },
    secondary: {
      light: "#ff5983",
      main: pink.A400,
      dark: "#bb002f",
      contrastText: "#000",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
  spacing: 10,
  typography: {
    fontFamily: [
      'Glory',
      '"Noto Sans"',
      'Roboto',
      'Arial'
    ].join(','),
  },
  overrides:{
    MuiPaper:{
      root:{
        fontFamily: 'Glory'
      }
    }
  }
});

export default theme;
