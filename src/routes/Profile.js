import React from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../firebase";

const Profile = () => {
  const history = useHistory();
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
