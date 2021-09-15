import { Button, Grid, Paper } from "@material-ui/core";
import React from "react";
import UserSelect from "../UserSelect";
import styles from "./AssignSelect.module.css";

interface IAssignSelectProps {
  activeUser: ()=>void,
  handleUserChange:(e)=>void,
  buttonText?:string,
  buttonAction?:()=>void,
}

function AssignSelect({
  activeUser,
  handleUserChange,
  buttonText,
  buttonAction,
}:IAssignSelectProps) {
  return (
    <Paper className={styles.AssignSelect}>
      <Grid container>
        <UserSelect
          activeUser={activeUser}
          handleUserChange={handleUserChange}
        />
        {buttonText && buttonAction && <Button onClick={buttonAction}>{buttonText && buttonText}</Button>}
      </Grid>
    </Paper>
  );
}

export default AssignSelect;
