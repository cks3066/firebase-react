import React from "react";
import AppRouter from "./Router";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

const App = (props) => {
  const [init, setInit] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(auth.currentUser);
  const [userObj, setUserObj] = React.useState(null);
  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName === null) {
          updateProfile(user, { displayName: "User" });
        }
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
        });
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = auth.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
    </>
  );
};

export default App;
