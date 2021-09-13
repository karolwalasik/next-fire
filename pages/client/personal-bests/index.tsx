import { Button, Container, Grid, InputAdornment } from "@material-ui/core";
import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { auth, firestore, serverTimestamp } from "../../../lib/firebase";
import firebase from "firebase";
import {
  FullscreenExitTwoTone,
  LocalConvenienceStoreOutlined,
} from "@material-ui/icons";
import PersonalBestsList from "../../../components/PersonalBestsList";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
  form: {
    display: "flex",
    justifyContent: "space-between",
    maxWidth: 767,
  },
}));

const addPersonalBest = async (name, result, setError) => {
  if (!name || !result) {
    setError("Fill every cell");
    return;
  }

  setError("");

  const uid = auth.currentUser.uid;
  const ref = firestore
    .collection("users")
    .doc(uid)
    .collection(`personalBests`);
  const currentResults = await ref.get();
  console.log(currentResults.docs);

  console.log(currentResults.docs.length);

  const data = {
    date: firebase.firestore.Timestamp.now(),
    result: result,
  };

  const isExcerciseAlreadyInDatabase = currentResults.docs.some(
    (doc) => doc.id == name
  );

  if (!isExcerciseAlreadyInDatabase) {
    await ref.doc(name).set({});
    await ref.doc(name).update({
      results: firebase.firestore.FieldValue.arrayUnion(data),
    });
  } else {
    setError("Exercise already exists");
  }
};

function PersonalBestsPage() {
  const classes = useStyles();
  const [exerciseName, setExerciseName] = React.useState("");
  const [exerciseResult, setExerciseResult] = React.useState("");
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    if (e.target.name === "exerciseName") {
      setExerciseName(e.target.value);
    } else {
      setExerciseResult(e.target.value);
    }
  };

  const handleClick = (e) => {
    addPersonalBest(exerciseName, exerciseResult, setError);
  };

  return (
    <Container maxWidth="lg">
      <p style={{ fontSize: 20, margin: "5px 0px 0" }}>Add new exercise</p>
      <form
        className={`${classes.root} ${classes.form}`}
        noValidate
        autoComplete="off"
      >
        <TextField
          value={exerciseName}
          name="exerciseName"
          id="exercise-input"
          label="Exercise Name"
          onChange={handleChange}
        />
        <TextField
          InputProps={{
            endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
          }}
          value={exerciseResult}
          name="exerciseResult"
          id="exercise-result"
          label="Result"
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handleClick}
        >
          Add
        </Button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <PersonalBestsList />
    </Container>
  );
}

export default PersonalBestsPage;
