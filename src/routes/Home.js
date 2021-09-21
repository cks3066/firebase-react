import React from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import Nweet from "../components/Nweet";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = React.useState("");
  const [nweets, setNweets] = React.useState([]);
  const [attachment, setAttachment] = React.useState("");
  const getNweets = async () => {
    const querySnapshot = await getDocs(collection(db, "nweets"));
    querySnapshot.forEach((document) => {
      console.log(document.data());
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  React.useEffect(() => {
    onSnapshot(
      query(collection(db, "nweets"), orderBy("createdAt", "desc")),
      (snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      }
    );
  }, []);
  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      //파일 경로 참조 만들기
      const fileRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 업로드 하기
      const uploadFile = await uploadString(fileRef, attachment, "data_url");
      //storage에 있는 파일 URL로 다운로드 받기
      attachmentUrl = await getDownloadURL(uploadFile.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    try {
      const docRef = await addDoc(collection(db, "nweets"), nweetObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNweet("");
    setAttachment("");
  };
  const onChange = (event) => {
    const value = event.target.value;
    setNweet(value);
  };
  const onFileChange = (event) => {
    const files = event.target.files;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const result = finishedEvent.currentTarget.result;
      setAttachment(result);
      console.log(attachment);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearPhotoClick = () => {
    setAttachment("");
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearPhotoClick}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((item) => (
          <Nweet
            key={item.id}
            nweetObj={item}
            isOwner={item.creatorId === userObj.uid}
          />
        ))}
      </div>
    </>
  );
};

export default Home;
