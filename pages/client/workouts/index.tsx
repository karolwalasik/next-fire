import { CircularProgress, Grid } from "@material-ui/core";
import React, { useEffect } from "react";
import AssignSelect from "../../../components/AssignSelect";
import AuthCheck from "../../../components/AuthCheck";
import Calendar from "../../../components/Calendar/Calendar";
import Dashboard from "../../../components/Dashborad/Dashboard";
import MetaTags from "../../../components/Metatags";
import UserSelect from "../../../components/UserSelect";
import {
  auth,
  firestore,
  getUserRole,
  getUserWithUsername,
} from "../../../lib/firebase";
import { useUserData, useUserRole } from "../../../lib/hooks";
import { Roles } from "../../enter";

export default function AdminExercisePage({}) {
  const uid = auth.currentUser?.uid;
  console.log(uid);

  const userData = useUserData();
  if (!userData.user) {
    return (
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <main>
      <MetaTags title="client workout page" />
      <AuthCheck>
        <Calendar authUser={uid} isOnClientPage={true} />
      </AuthCheck>
    </main>
  );
}
