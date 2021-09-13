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
  const [activeUser, setActiveUser] = React.useState(null);
  const [activeUserId, setActiveUserId] = React.useState(null);
  const handleChange = (event) => {
    setActiveUser(event.target.value);
  };

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const getActive = async () => {
      const activeUserObject = await getUserWithUsername(activeUser);
      if (activeUserObject?.id) {
        setActiveUserId(activeUserObject.id);
      }
    };
    getActive();
  }, [activeUser]);

  async function copyCollection() {
    console.log(activeUser);
    const documents = await firestore
      .collection(`users/${uid}/activities`)
      .get();
    const activeUserObject = await getUserWithUsername(activeUser);

    let writeBatch = firestore.batch();
    const destCollection = await firestore.collection(
      `users/${activeUserObject.id}/activities`
    );
    console.log(destCollection);
    let i = 0;
    for (const doc of documents.docs) {
      console.log(
        "DOC",
        doc,
        doc.data(),
        "dest collection",
        destCollection.doc(doc.id)
      );
      writeBatch.set(destCollection.doc(doc.id), doc.data());
      i++;
      if (i > 400) {
        // write batch only allows maximum 500 writes per batch
        i = 0;
        console.log("Intermediate committing of batch operation");
        await writeBatch.commit();
        writeBatch = firestore.batch();
      }
    }
    if (i > 0) {
      console.log(
        "Firebase batch operation completed. Doing final committing of batch operation."
      );
      await writeBatch.commit();
    } else {
      console.log("Firebase batch operation completed.");
    }
  }
  //   console.log('get user',getUserRole());
  const userRole = useUserRole();
  console.log(userRole);
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
      <MetaTags title="admin workout page" />
      <AuthCheck>
        {userRole === Roles.TRAINER && (
          <AssignSelect
            activeUser={activeUser}
            handleUserChange={handleChange}
            buttonText={"Save workout plan"}
            buttonAction={copyCollection}
          />
        )}
        <Calendar authUser={activeUserId} isOnClientPage={false} />
      </AuthCheck>
    </main>
  );
}
