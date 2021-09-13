import { Button, Grid, Paper } from "@material-ui/core";
import React from "react";
import UserSelect from "../UserSelect";
import styles from "./AssignSelect.module.css";

function AssignSelect({
  activeUser,
  handleUserChange,
  buttonText,
  buttonAction,
}) {
  return (
    <Paper className={styles.AssignSelect}>
      <Grid container>
        <UserSelect
          activeUser={activeUser}
          handleUserChange={handleUserChange}
        />
        <Button onClick={buttonAction}>{buttonText && buttonText}</Button>
      </Grid>
    </Paper>
  );
}

export default AssignSelect;
