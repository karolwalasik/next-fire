import {
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  TableBody,
  Typography,
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import React from "react";
import { auth, firestore } from "../../lib/firebase";
import { useUserData } from "../../lib/hooks";
import Paper from "@material-ui/core/Paper";
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
} from "@devexpress/dx-react-chart-material-ui";
import firebase from "firebase";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

const updatePersonalBest = async (name, result) => {
  if (!name || !result) {
    return;
  }
  //
  const uid = auth.currentUser.uid;
  const data = {
    date: firebase.firestore.Timestamp.now(),
    result: result,
  };

  const ref = firestore.doc(`users/${uid}/personalBests/${name}`);

  ref.update({
    results: firebase.firestore.FieldValue.arrayUnion(data),
  });
};

function PersonalBestsDetails({ exerciseName, expanded,clientId=null }) {
  const [personalBestsDetails, setPersonalBestsDetails] = React.useState([]);
  const [newResult, setNewResult] = React.useState("");
  const { user } = useUserData();
  const classes = useStyles();

  const createTableHead = (data) => {
    const names = Object.keys(data[0]);
    return (
      <TableHead>
        <TableRow>
          {names.map((name) => (
            <TableCell key={name}>{name}</TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const generateChart = (data) => {
    return (
      <Paper>
        <Chart data={data}>
          <ArgumentAxis />
          <ValueAxis />

          <LineSeries valueField="result" argumentField="date" />
        </Chart>
      </Paper>
    );
  };

  const createTableBody = (data) => {
    return (
      <TableBody>
        {data.map((dataRow) => (
          <TableRow key={`${dataRow.date}-${dataRow.result}`}>
            <TableCell>{dataRow.date}</TableCell>
            <TableCell>{dataRow.result} kg</TableCell>
          </TableRow>
        ))}
        {data.length > 3 && generateChart(data)}
      </TableBody>
    );
  };

  const retrieveData = async () => {
    if (!user?.uid || !expanded) {
      return;
    }
    let ref = await firestore
      .doc(`users/${clientId ?? user.uid}/personalBests/${exerciseName}`)
      .onSnapshot((snapshot) => {
        console.log(snapshot.data()?.results);
        if (snapshot.data()?.results) {
          const newResults = snapshot.data().results?.map((singleResult) => {
            return {
              date: new Date(
                singleResult.date.seconds * 1000
              ).toLocaleDateString("pl"),
              result: Number(singleResult.result),
            };
          });
          setPersonalBestsDetails(newResults);
        }
      });
  };

  React.useEffect(() => {
    retrieveData();
  }, [user, expanded]);

  const handleInputChange = (e) => {
    setNewResult(e.target.value);
  };

  return (
    <>
      {!!personalBestsDetails?.length && (
        <TableContainer component={Paper}>
          {!clientId && <><p style={{ marginLeft: 20 }}>Add new score</p>
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{paddingRight:20}}
          >
            <TextField
              value={newResult}
              onChange={handleInputChange}
              style={{ marginLeft: 20 }}
              id="new-result-input"
              label="Result"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updatePersonalBest(exerciseName, newResult)}
            >
              Add
            </Button>
          </Grid></>}
          <Table className={classes.table}>
            {createTableHead(personalBestsDetails)}
            {createTableBody(personalBestsDetails)}
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default PersonalBestsDetails;
