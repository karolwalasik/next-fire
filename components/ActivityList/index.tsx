import React, { useEffect } from "react";
// import loader from './loader.gif';
import { auth, firestore } from "../../lib/firebase";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import CommentIcon from "@material-ui/icons/Comment";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import theme from "../../lib/theme";
import { Typography } from "@material-ui/core";
import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import LinkIcon from '@material-ui/icons/Link';
import router from "next/router";

function ActivityList(props) {
  const {
    loading,
    activities,
    editActivity,
    setOpenSnackbar,
    setSnackbarMsg,
    setEditing,
  } = props;

  const useStyles = makeStyles((theme) =>
    createStyles({
      modal: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "scroll",
        top:20 
      },
      paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
    })
  );

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modalActivityId, setModalActivityId] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const [commentsForCurrentActivity, setCommentsForCurrentActivity] =
    React.useState([]);

  

  const retrieveData = async () => {
    console.log("POBIERANIE KOMENTOW");
    console.log(`users/${props.authUser}/activities/${modalActivityId}`);
    let ref = await firestore
      .doc(
        `users/${
          props.isOnClientPage ? auth.currentUser?.uid : props.authUser
        }/activities/${modalActivityId}`
      )
      .onSnapshot((snapshot) => {
        console.log(snapshot.data());
        console.log(snapshot.data()?.comments);
        if (snapshot.data()?.comments) {
          const newResults = snapshot.data().comments?.map((singleResult) => {
            return {
              date: new Date(
                singleResult.date.seconds * 1000
              ).toLocaleDateString("pl"),
              comment: singleResult.comment,
              username: singleResult.username,
            };
          });
          // setPersonalBestsDetails(newResults)
          setCommentsForCurrentActivity(newResults);
        } else {
          setCommentsForCurrentActivity([]);
        }
      });
  };

  useEffect(() => {
    retrieveData();
  }, [modalActivityId,props]);

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const addComment = async () => {
    const ref = firestore.doc(
      `users/${
        props.isOnClientPage ? auth.currentUser?.uid : props.authUser
      }/activities/${modalActivityId}`
    );

    const data = {
      date: firebase.firestore.Timestamp.now(),
      comment: comment,
      username: auth.currentUser?.displayName,
    };

    await ref.update({
      comments: firebase.firestore.FieldValue.arrayUnion(data),
    });
    setComment("");
  };

  const handleOpen = (activityId) => {
    setOpen(true);
    setModalActivityId(activityId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateActivity = (uid, activity, activityId) => {
    const ref = firestore.doc(`users/${uid}/activities/${activityId}`);
    // const ref = this.db.ref().child(`users/${uid}/activities/${activityKey}`);
    ref.update(activity);
  };

  const deleteActivity = (id) => {
    // Get key of activity in firebase
    //    const activityId = Object.keys(activities)[i];
    // Connect to our firebase API
    const emptyActivity = {
      date: null,
      duration: null,
      type: null,
      name: null,
      reps: null,
      sets: null,
      slug: null
    };

    updateActivity(auth.currentUser.uid, emptyActivity, id);

    // Show notification
    setOpenSnackbar(true);
    setSnackbarMsg("Deleted activity");
    setTimeout(() => {
      setOpenSnackbar(false);
    }, 3000);

    // stop editing
    setEditing(false);
  };

  return (
    <>
      {loading === true ? <p>loading</p> : ""}

      {activities === "not set" || activities === null ? (
        <p>No activities added yet.</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Sets</TableCell>
                <TableCell>Reps</TableCell>
                <TableCell>
                  {props.isOnClientPage ? "Comment" : "Actions"}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.values(activities).map((activity:any, i) => {
                let { name, type, duration, reps, sets } = activity.data();
                switch (type) {
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
                }
                return (
                  <TableRow key={i}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{type}</TableCell>
                    <TableCell>{duration}</TableCell>
                    <TableCell>{sets}</TableCell>
                    <TableCell>{reps}</TableCell>
                    {props.isOnClientPage === true ? (
                      <TableCell>
                        <CommentIcon onClick={(e) => handleOpen(activity.id)} />
                      </TableCell>
                    ) : (
                      <TableCell>
                        <DeleteIcon
                          onClick={(e) => deleteActivity(activity.id)}
                        />
                        <EditIcon
                          onClick={(e) => editActivity(activity, activity.id)}
                          style={{ marginLeft: "20px" }}
                        />
                        <CommentIcon onClick={(e) => handleOpen(activity.id)} style={{ marginLeft: "20px" }}/>
                        {activity.slug && <LinkIcon onClick={()=>router.push(`/admin/exercises/${activity.slug}`)}/>}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{top:'15vh'}}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">Comments</h2>
            {!!commentsForCurrentActivity?.length &&
              commentsForCurrentActivity.map((comment) => {
                return (
                  <Grid style={{marginBottom:10}}>
                    <p style={{color: '#cacaca'}}>{comment.date}</p>
                    <Typography style={{maxWidth:320}}>{comment.comment}</Typography>
                    <Typography color={"textSecondary"} 
                    // style={{color: '#0095a8',fontSize: 13}}
                    >{comment.username}</Typography>
                  </Grid>
                );
              })}
            <p style={{borderTop: '1px solid #cacaca',paddingTop:10}}id="transition-modal-description">Add comment:</p>
            <Grid container alignItems="center"  >
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Add comment"
              onChange={handleComment}
              value={comment}
            />
            <Button onClick={addComment}>Add comment</Button></Grid>
          </div>
        </Fade>
      </Modal>
    </>
  );
}

export default ActivityList;
