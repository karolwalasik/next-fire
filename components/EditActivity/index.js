import React, { useEffect, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { firestore, auth } from "../../lib/firebase";
import { usePrevious } from "../../lib/hooks";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function EditActivity(props) {
  const classes = useStyles();

  const {
    authUser,
    firebase,
    activity,
    activityKey,
    setEditing,
    setOpenSnackbar,
    setSnackbarMsg,
  } = props;
  const uid = authUser.uid;

  // Set default activity object
  const defaultActivity = {
    name: activity.name,
    type: activity.type,
    duration: activity.duration,
    date: activity.date,
    reps: activity.reps,
    sets: activity.sets,
  };

  const [newActivity, setNewActivity] = useState(defaultActivity);

  const prevActivity = usePrevious({ activity });

  useEffect(() => {
    if (prevActivity?.name !== activity.name) {
      setNewActivity(activity);
    }
  }, [activity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(newActivity)
    setNewActivity({
      ...newActivity,
      [name]: value,
    });
  };




  const handleSlider = (e,value,name) => {
  
    console.log(e,value,name)


    setNewActivity({
      ...newActivity,
      [name]: parseInt(value),
    });
  
  };

  const isValid = newActivity.name === "";

  const updateActivity = (uid, activity, activityId) => {
    const ref = firestore.doc(`users/${uid}/activities/${activityId}`);
    // const ref = this.db.ref().child(`users/${uid}/activities/${activityKey}`);
    ref.update(activity);
  };

  // Add the activity to firebase via the API made in this app
  const handleSubmit = (action) => {
    if (authUser) {
      updateActivity(props.authUser, newActivity, activityKey);

      console.log(props.authUser,newActivity,activityKey)
      setEditing(false);
      // Show alert and hide after 3sec
      setOpenSnackbar(true);
      setSnackbarMsg("Updated activity");
      setTimeout(() => {
        setOpenSnackbar(false);
      }, 3000);
    }
  };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <FormControl className={classes.formControl}>
        <TextField
          style={{ marginTop: "5px" }}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={newActivity.name}
          label="Activity name"
          name="name"
          onChange={handleChange}
        />
        <div style={{ marginTop: "20px", marginBottom: "30px" }}>
          <Typography id="discrete-slider" gutterBottom>
            Type
          </Typography>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newActivity.type}
            style={{ minWidth: "100%" }}
            name="type"
            onChange={handleChange}
          >
            <MenuItem value={1}>Lifting Weights</MenuItem>
            <MenuItem value={2}>Running</MenuItem>
            <MenuItem value={3}>Cycling</MenuItem>
          </Select>
        </div>
        {newActivity.type !== 1 && (
          <>
            <Typography id="discrete-slider" gutterBottom>
              Duration
            </Typography>
            <Slider
              defaultValue={parseInt(newActivity.duration)}
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              step={10}
              marks
              min={10}
              max={120}
              name="duration"
              onChange={(e,val)=>handleSlider(e,val,'duration')}
              style={{ marginBottom: "20px" }}
            />
          </>
        )}
        {newActivity.type === 1 && (
          <>
            <Typography id="sets" gutterBottom>
              Sets
            </Typography>
            <Slider
              defaultValue={parseInt(newActivity.sets)}
              aria-labelledby="sets"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={8}
              name="sets"
              onChange={(e,val)=>handleSlider(e,val,'sets')}
              style={{ marginBottom: "20px" }}
            />
          </>
        )}
        {newActivity.type === 1 && (
          <>
            <Typography id="reps" gutterBottom>
              Reps
            </Typography>
            <Slider
              defaultValue={parseInt(newActivity.reps)}
              aria-labelledby="reps"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={25}
              name="reps"
              onChange={(e,val)=>handleSlider(e,val,'reps')}
              style={{ marginBottom: "20px" }}
            />
          </>
        )}
      </FormControl>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        onClick={() => handleSubmit("add")}
        disabled={isValid}
      >
        Save activity
      </Button>
    </form>
  );
}

export default EditActivity;
