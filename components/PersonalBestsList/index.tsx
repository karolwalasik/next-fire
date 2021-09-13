import React from "react";
import { auth, firestore } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";
import PersonalBestsListItem from "../PersonalBestsListItem";
import styles from "./PersonalBestList.module.css";

function PersonalBestsList() {
  const [personalBestsList, setPersonalBestsList] = React.useState([]);
  const { user } = useUserData();

  console.log("render");

  const retrieveData = async () => {
    if (!user?.uid) {
      return;
    }
    let ref = await firestore
      .collection(`users/${user.uid}/personalBests`)
      .onSnapshot((snpashot) => {
        const personalBests = snpashot.docs.map((doc) => doc.id);
        //@ts-ignore
        setPersonalBestsList(personalBests);
        // setLoading(false)
      });
  };

  React.useEffect(() => {
    retrieveData();
  }, [user]);

  return (
    <>
      {!!personalBestsList?.length && (
        <div className={styles.personalBestsList}>
          {personalBestsList.map((pb) => (
            <PersonalBestsListItem key={pb} name={pb} />
          ))}
        </div>
      )}
    </>
  );
}

export default PersonalBestsList;
