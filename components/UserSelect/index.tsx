import { RotateLeftSharp } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { firestore } from "../../lib/firebase";
import { Roles } from "../../pages/enter";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function UserSelect({activeUser,handleUserChange}){
    const classes = useStyles();
    const [usersList,setUsersList] = React.useState([])
    const [loading,setLoading] = React.useState(false)
   


    const retrieveUsersList = async () => {
        let ref = await firestore.collection(`users`).onSnapshot(snpashot=>{
            const users = snpashot.docs.filter(snap=>(snap.data().role===Roles.CLIENT)).map(snap=>snap.data())
            
            setUsersList(users)

        })
    };

    React.useEffect(()=>{
        retrieveUsersList()
    },[])


    return <div>
        <FormControl className={classes.formControl}>
            <InputLabel id="user-select-label">User</InputLabel>
            <Select
            labelId="user-select-label"
            id="user-select"
            value={activeUser || ''}
            onChange={handleUserChange}
            >
                {usersList.length && usersList.map(user=><MenuItem key={user.username} value={user.username}>{user.username}</MenuItem>)}
            </Select>
        </FormControl></div>
}

export default UserSelect