import React, {useState} from 'react';
import moment from 'moment';

import Grid from '@material-ui/core/Grid';
import CalendarHead from './calendar-head';

import CalendarBody from './calendar-body';
import AddActivity from '../AddActivity/AddActivity';
import ActivityList from '../ActivityList'
import EditActivity from '../EditActivity'

import { Paper, Snackbar } from '@material-ui/core';
import {firestore,auth,increment} from '../../lib/firebase';
import {useUserData} from "../../lib/hooks";
import { SettingsApplications } from '@material-ui/icons';
import { UserContext } from '../../lib/context';


function Calendar(props){
    moment.locale('pl')
/* HOOKS */
    const [dateObject, setdateObject] = useState(moment());
    const [showMonthTable, setShowMonthTable] = useState(false);

    const defaultSelectedDay = {
        day: moment().format("D"),
        month: moment().month(),
        // year?: moment().year()
        }

    const [selectedDay, setSelected] = useState(defaultSelectedDay);

    /* CALENDAR HEAD */
    const allMonths = moment.months();
    const currentMonth = () => dateObject.format("MMMM");
    const currentYear = () => dateObject.format("YYYY");

    const setMonth = month => {
        let monthNo = allMonths.indexOf(month);
        let newDateObject = Object.assign({}, dateObject);
        newDateObject = moment(dateObject).set("month", monthNo);
        setdateObject(newDateObject);
        setShowMonthTable(false);
    }

    const toggleMonthSelect = () => setShowMonthTable(!showMonthTable);

    /*** CALENDAR BODY ***/
    const setSelectedDay = day => {
        setSelected({
                day,
                month: currentMonthNum()
        });
        setEditing(false)
        // Later refresh data
    };

    const currentMonthNum = () => dateObject.month();
    const daysInMonth = () => dateObject.daysInMonth();
    const currentDay = () => dateObject.format("D");
    const actualMonth = () => moment().format("MMMM");

    const firstDayOfMonth = () => moment(dateObject).startOf("month").format("d");



    /*** ADDING AN ACTIVITY ***/
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMsg, setSnackbarMsg] = React.useState(null);
    // const {userData, username} = React.useContext(UserContext)

    /*** ACTIVITY LIST ***/
    const [activities, setActivities] = useState(()=>[]);
    const [loading, setLoading] = useState(true);

    const [editing, setEditing] = useState(false);
    const [activity, setActivity] = useState(null);
    const [activityKey, setActivityKey] = useState(null);

    const editActivity = (activity, i) => {
        console.log(activity,i)
        // console.log('%c activities','font-size:24px',activities)
        console.log(activity.data());
        
        setActivityKey(i);
        setEditing(true); 
        setActivity(activity.data());
    }


    const retrieveData = async () => {
        //@ts-ignore
        let queryDate = `${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`;
        console.log('%c activities','font-size: 24px',activities,selectedDay)
        console.log(props.authUser)

        let ref = await firestore.collection(`users/${props.authUser}/activities`).onSnapshot(snpashot=>{
            const activities = snpashot.docs.filter(snap=>(snap.data().date===queryDate))
            //@ts-ignore
            setActivities(activities)
            setLoading(false)
        })

        retrieveActiveDays()


    };

    const retrieveActiveDays = async() => {
        await firestore.collection(`users/${props.authUser}/activities`).onSnapshot(snpashot=>{
            const arr = snpashot.docs.map(snap=> {
                if(snap.data().date){
                 return snap.data().date.length===8 ? snap.data().date.slice(0,3): snap.data().date.slice(0,4)
                }
                
            })
            console.log('arr',arr)
            setActiveDays(arr)
        })
        // let ref = firebase.db.ref().child(`users/${authUser.uid}/activities`);
        // ref.on("value", snapshot => {
        //     let data = snapshot.val();
        //     const values = Object.values(data);
        //     // Store all active day/month combinations in array for calendar
        //     const arr = values.map(obj => {
        //         return obj.date.length === 8
        //         ? obj.date.slice(0,3)
        //         : obj.date.slice(0,4)
        //     });
        //     setActiveDays(arr);
        // });
    }

    React.useEffect(()=>{
        retrieveData()
    },[selectedDay,props]);

    const [activeDays, setActiveDays] = useState([]);

    return <Grid container spacing={3}>
                <Grid item xs={12} md={8} lg={9}>
                    <CalendarHead
                        allMonths={allMonths}
                        currentMonth={currentMonth}
                        currentYear={currentYear}
                        setMonth={setMonth}
                        showMonthTable={showMonthTable}
                        toggleMonthSelect={toggleMonthSelect}
                    />
                    <CalendarBody 
                    firstDayOfMonth={firstDayOfMonth}
                    daysInMonth={daysInMonth}
                    currentDay={currentDay}
                    currentMonth={currentMonth}
                    currentMonthNum={currentMonthNum}
                    actualMonth={actualMonth}
                    setSelectedDay={setSelectedDay}
                    selectedDay={selectedDay}
                    weekdays={moment.weekdays(true)} 
                    activeDays={activeDays}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper className="paper">
                        { editing
                            ?
                                <>
                                    <h3>Edit activity on {selectedDay.day}-{selectedDay.month + 1} </h3>
                                    <EditActivity 
                                        activity={activity}
                                        activityKey={activityKey}
                                        selectedDay={selectedDay} 
                                        authUser={props.authUser}
                                        setEditing={setEditing}
                                        setOpenSnackbar={setOpenSnackbar}
                                        setSnackbarMsg={setSnackbarMsg}
                                    />
                                </>
                            :
                                <>
                                    <h3>Add activity on {selectedDay.day}-{selectedDay.month + 1} </h3>
                                    <AddActivity 
                                        selectedDay={selectedDay} 
                                        authUser={props.authUser}
                                        setOpenSnackbar={setOpenSnackbar}
                                        setSnackbarMsg={setSnackbarMsg}
                                    />
                                </>
                        }
                    </Paper>
                </Grid>
                <Grid item xs={12} md={7}>
                    <Paper className="paper">
                    <h3>Activities on {selectedDay.day}-{selectedDay.month + 1}</h3>
                    <ActivityList
                        loading={loading}
                        activities={activities}
                        authUser={props.authUser}
                        setOpenSnackbar={setOpenSnackbar}
                        setSnackbarMsg={setSnackbarMsg}
                        setEditing={setEditing}
                        editActivity={editActivity}
                    />
                    </Paper>
                </Grid>
                <Snackbar 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSnackbar} 
                message={snackbarMsg}
            />
            </Grid>
}

export default Calendar;