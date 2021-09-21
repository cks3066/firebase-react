import React from "react";
import { useHistory } from "react-router-dom";
import { auth, db } from "../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({ refreshUser, userObj }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = React.useState(
    userObj.displayName
  );
  const onLogOutClick = () => {
    auth.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const q = query(
      collection(db, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };
  React.useEffect(() => {
    getMyNweets();
  }, []);
  const onChange = (e) => {
    setNewDisplayName(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(await auth.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          autoFocus
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;
