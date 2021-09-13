import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import theme from "../lib/theme";
import { CircularProgress, Grid, ThemeProvider } from "@material-ui/core";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();

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
