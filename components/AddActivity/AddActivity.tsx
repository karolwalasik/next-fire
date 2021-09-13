import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import { addActivity, auth } from '../../lib/firebase';

const useStyles = makeStyles(theme => ({
    formControl: {
      minWidth: '100%',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
}));

function AddActivity(props) {
    const classes = useStyles();

    const {authUser, firebase, selectedDay, setOpenSnackbar, setSnackbarMsg} = props;
    const uid = auth.currentUser?.uid;

    // Set query date for updating database
    selectedDay.year = new Date().getFullYear();
    let queryDate = `${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`;
   

    // Set default activity object
    const defaultActivity = {
        name: '',
        type: 1,
        duration: 60,
        date: queryDate,
        reps: 12,
        sets: 4
    }

    const [activity, setActivity] = useState(defaultActivity);

   

    const handleChange = e => {
        const { name, value } = e.target
        setActivity({
            ...activity, 
            date: queryDate,
            [name]: value});
    }

    const handleSlider = e => {
        const value = e.target.getAttribute('aria-valuenow');
        console.log(value);
        
        setActivity({...activity, [e.target.getAttribute('aria-labelledby')]: value});
    }

    const isValid = activity.name === '';

    // Add the activity to firebase via the API made in this app
    const handleSubmit = () => {
        if (authUser) {
            let newActivity = {...activity}
            if(activity.type ===1){
                newActivity.duration = null;
            }
            if(activity.type!==1){
                newActivity.reps = null;
                newActivity.sets = null;
            }
            console.log(newActivity,activity)
            addActivity(uid, newActivity);
            setActivity(defaultActivity);
            // Show notification
            setOpenSnackbar(true);
            setSnackbarMsg('Added activity');
            setTimeout(() => {
                setOpenSnackbar(false)
            }, 3000)
        }
    }
    // if(!uid){
    //     return null;
    // }

    return (
        <form noValidate onSubmit={e => e.preventDefault()}>
            <FormControl className={classes.formControl}>
                <TextField
                    style={{marginTop: '5px'}}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Activity name"
                    value={activity.name}
                    name="name"
                    onChange={handleChange}
                />
                <div style={{marginTop: '20px', marginBottom: '30px'}}>
                    <Typography id="discrete-slider" gutterBottom>
                        Type
                    </Typography>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={activity.type}
                        style={{minWidth: '100%'}}
                        name="type"
                        onChange={handleChange}
                    >
                        <MenuItem value={1}>Lifting Weights</MenuItem>
                        <MenuItem value={2}>Running</MenuItem>
                        <MenuItem value={3}>Cycling</MenuItem>
                    </Select>
                </div>
                {activity.type !== 1 && <><Typography id="duration" gutterBottom>
                    Duration
                </Typography>
                <Slider
                    defaultValue={activity.duration}
                    aria-labelledby="duration"
                    valueLabelDisplay="auto"
                    step={10}
                    marks
                    min={10}
                    max={120}
                    name="duration"
                    onChange={handleSlider}
                    style={{marginBottom: '20px'}}
                /></>}
                {activity.type===1 && <><Typography id="reps" gutterBottom>
                    Sets
                </Typography>
                <Slider
                    defaultValue={activity.sets}
                    aria-labelledby="sets"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={8}
                    name="sets"
                    onChange={handleSlider}
                    style={{marginBottom: '20px'}}
                /></>}
                {activity.type===1 && <><Typography id="reps" gutterBottom>
                    Reps
                </Typography>
                <Slider
                    defaultValue={activity.reps}
                    aria-labelledby="reps"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={25}
                    name="reps"
                    onChange={handleSlider}
                    style={{marginBottom: '20px'}}
                /></>}
            </FormControl>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isValid}
            >
            Add activity
            </Button>
        </form>
    )
};

export default AddActivity;