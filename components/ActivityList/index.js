import React from 'react';
// import loader from './loader.gif';
import {auth,firestore} from '../../lib/firebase'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

function ActivityList(props) {
    const {loading, activities, editActivity,setOpenSnackbar, setSnackbarMsg, setEditing} = props;

    const updateActivity = (uid, activity, activityId) => {
        const ref = firestore.doc(`users/${uid}/activities/${activityId}`);
        // const ref = this.db.ref().child(`users/${uid}/activities/${activityKey}`);
        ref.update(activity);
        }   

    const deleteActivity = (id) => {
        // Get key of activity in firebase
    //    const activityId = Object.keys(activities)[i];
       // Connect to our firebase API
       const emptyActivity = {
            date: null,
            duration: null,
            type: null,
            name: null,
       };

        updateActivity(auth.currentUser.uid, emptyActivity, id);

       // Show notification
       setOpenSnackbar(true);
       setSnackbarMsg('Deleted activity');
       setTimeout(() => {
        setOpenSnackbar(false)
       }, 3000)

       // stop editing
       setEditing(false);
    }

    return (
        <>
            { 
                loading === true 
                    ? <p>loading</p> 
                    : ''
            }
            
            {
                activities === 'not set' || activities === null
                    ? <p>No activities added yet.</p>
                    :
                    <TableContainer component={Paper} >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Duration</TableCell>
                                    <TableCell>reps</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {
                                Object.values(activities).map((activity, i) => {
                                    let {name, type, duration,reps} = activity.data();
                                    switch(type) {
                                        case 1:
                                            type = "Lifting weights";
                                            break;
                                        case 2:
                                            type = "Running";
                                            break;
                                        case 3:
                                            type = "Cycling";
                                            break;
                                        default:
                                            type = "Not set";
                                    };
                                    return (
                                        <TableRow key={i}>
                                            <TableCell>{name}</TableCell>
                                            <TableCell>{type}</TableCell>
                                            <TableCell>{duration}</TableCell>
                                            <TableCell>{reps}</TableCell>
                                            <TableCell>
                                                <DeleteIcon 
                                                    onClick={e => deleteActivity(activity.id)}
                                                />
                                                <EditIcon
                                                    onClick={e => editActivity(activity, activity.id)}
                                                    style={{marginLeft:"20px"}}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            }
                            </TableBody>
                        </Table>
                    </TableContainer>
            }
        </>
    )
};

export default ActivityList;