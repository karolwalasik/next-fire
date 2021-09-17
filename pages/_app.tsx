import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import theme from "../lib/theme";
import { CircularProgress, createTheme, Grid, ThemeProvider, useMediaQuery } from "@material-ui/core";
import darkTheme from "../lib/darkTheme";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();


  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const theme = React.useMemo(
  //   () =>
  //     createTheme({
  //       palette: {
  //         type: prefersDarkMode ? 'dark' : 'light',
  //       },
  //     }),
  //   [prefersDarkMode],
  // );

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={userData}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default MyApp;
