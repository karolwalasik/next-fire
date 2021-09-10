import { CircularProgress, Grid } from "@material-ui/core";
import React from "react";
import AuthCheck from "../../../components/AuthCheck";
import Calendar from "../../../components/Calendar/Calendar";
import Dashboard from "../../../components/Dashborad/Dashboard";
import MetaTags from "../../../components/Metatags";
import UserSelect from "../../../components/UserSelect";
import { auth, getUserRole } from "../../../lib/firebase";
import { useUserData, useUserRole } from "../../../lib/hooks";

export default function AdminExercisePage({}) {
    const [activeUser,setActiveUser] = React.useState(null)

    const handleChange = (event) => {
        setActiveUser(event.target.value);
      }; 
    //   console.log('get user',getUserRole());
    const userRole = useUserRole()
    console.log(userRole)
    const userData = useUserData()
    if(!userData.user){
        return <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      ><CircularProgress /></Grid>
      }
      
    return (
        <main>
            <MetaTags title="admin workout page" />
            <AuthCheck>
                <UserSelect activeUser={activeUser} handleUserChange={handleChange}/>
                <Calendar authUser={auth.currentUser}/>
            </AuthCheck>
        </main>
    );
}