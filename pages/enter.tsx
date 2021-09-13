import { firestore, googleAuthProvider } from "../lib/firebase";
import { auth } from "../lib/firebase";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../lib/context";
import { debounce } from "lodash";
import Loader from "../components/Loader";
import { Button, Grid, MenuItem, Select, InputLabel, FormControl } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

export enum Roles {
  TRAINER = 'trainer',
  CLIENT = 'client'
}

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <SignInButton />
        </Grid>
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    try {
      await auth.signInWithPopup(googleAuthProvider);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={signInWithGoogle}>
      Sign in
    </Button>
  );
}

function SignOutButton() {
  return <Button variant="contained" color="primary" onClick={() => auth.signOut()}>Sign out</Button>;
}

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, username } = useContext(UserContext);
  const [role, setRole] = React.useState(Roles.CLIENT);
  const classes = useStyles();

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }
    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        // console.log("firestore read");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      //stoworzenie referencji do obu dokumentow
      await firestore.collection('users').add({uid:user.uid})
      const userDoc = firestore.doc(`users/${user.uid}`);
      const usernameDoc = firestore.doc(`usernames/${formValue}`);
      //zapis obu do firesotre
      const batch = firestore.batch();
      batch.set(userDoc, {
        username: formValue,
        photoUrl: user.photoURL || "",
        displayName: user.displayName || "",
        role: role
      });
      batch.set(usernameDoc, { uid: user.uid });

      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    !username && (
      <section>
        <h3>Choose username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <FormControl className={classes.formControl}>
            <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={role}
                onChange={handleChange}
                displayEmpty
                className={classes.selectEmpty}
                inputProps={{ 'aria-label': 'Without label' }}
              >
              
                <MenuItem value={Roles.TRAINER}>{Roles.TRAINER}</MenuItem>
                <MenuItem value={Roles.CLIENT}>{Roles.CLIENT}</MenuItem>
          
            </Select>
        </FormControl>
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose{" "}
          </button>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking ...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken</p>;
  } else {
    return null;
  }
}
