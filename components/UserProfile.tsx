import { Typography } from "@material-ui/core";
import React from "react";

export default function UserProfile({ user }) {
  return (
    <div className="box-center">
      <img src={user?.photoUrl} className="card-img-center" />
      <Typography>
        <i>@{user?.username}</i>
      </Typography>
      <h1>{user?.displayName}</h1>
    </div>
  );
}
