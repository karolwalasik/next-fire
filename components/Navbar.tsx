import React, { useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import { Grid, Link, Menu, MenuItem, Theme } from "@material-ui/core";
import { UserContext } from "../lib/context";
// import ModalDialog from './ModalDialog';
import { useRouter } from "next/router";
import { NavigationMap } from "./maps/NavigationMap";
import { useUserRole } from "../lib/hooks";
import { Roles } from "../pages/enter";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  })
);

const Navbar = () => {
  const classes = useStyles();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { user, username } = React.useContext(UserContext);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (route?) => {
    setAnchorEl(null);
    router.push(route);
  };

  const userRole = useUserRole();

  const getNavigationBasedOnRoute = (str) => {
    var n = str.lastIndexOf("/");
    const result = str.substring(n + 1);
    return result;
    //  return result.charAt(0).toUpperCase() + result.slice(1);
  };

  console.log(router);

  return (
    <AppBar position="static">
      <Toolbar>
        {!username ? (
          <>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Link href="/">
                <Button variant="outlined" style={{ color: "#ffffff" }}>
                  Feed
                </Button>
              </Link>
              <Link href="/enter">
                <Button variant="outlined" style={{ color: "#ffffff" }}>
                  Log in
                </Button>
              </Link>
            </Grid>
          </>
        ) : (
          <>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleClose("/")}>Feed</MenuItem>

              {userRole === Roles.TRAINER ? (
                <>
                  <MenuItem onClick={() => handleClose("/admin")}>
                    Write posts
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("/admin/exercises")}>
                    My exercises
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("/admin/messages")}>
                    Messages
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("/admin/workouts")}>
                    Workouts
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    onClick={() => handleClose("/client/personal-bests")}
                  >
                    Personal bests
                  </MenuItem>
                  <MenuItem onClick={() => handleClose("/client/workouts")}>
                    Workouts
                  </MenuItem>
                </>
              )}
            </Menu>
            <Typography
              variant="h6"
              className={classes.title}
              style={{ flexGrow: 1 }}
            >
              {NavigationMap.get(router.route)}
            </Typography>
            <Link href={`/${username}`} style={{ width: 50, height: 50 }}>
              <img src={user?.photoURL} style={{ borderRadius: 50 }} />
            </Link>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

// import Link from "next/link";
// import { UserContext } from "../lib/context";
// import { useContext } from "react";
// import {auth} from "../lib/firebase";
// import router, { useRouter } from "next/router";

// export default function Navbar() {
//   const { user, username } = useContext(UserContext);

//   return (
//     <nav className="navbar">
//       <ul>
//         <li>
//           <Link href="/">
//             <button>feed</button>
//           </Link>
//         </li>
//         {username && (
//           <>
//             <li>
//               <Link href="/admin">
//                 <button>Write posts</button>
//               </Link>
//             </li>
//             <li>
//               <Link href={'/admin/exercises'}>
//                 <button>My exercises</button>
//               </Link>
//             </li>
//             <li>
//               <Link href={'/admin/messages'}>
//                 <button>Messages</button>
//               </Link>
//             </li>
//             <li>
//               <button onClick={() => {
//                 router.push('/');
//                 setTimeout(()=>auth.signOut())

//                 }}>sign out</button>
//             </li>
//             <li>
//               <Link href={`/${username}`}>
//                 <img src={user?.photoURL} />
//               </Link>
//             </li>
//           </>
//         )}
//         {!username && (
//           <li>
//             <Link href="/enter">
//               <button>Log in</button>
//             </Link>
//           </li>
//         )}
//       </ul>
//     </nav>
//   );
// }
