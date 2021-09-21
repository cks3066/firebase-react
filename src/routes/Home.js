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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = React.useState("");
  const [nweets, setNweets] = React.useState([]);
  const [attachment, setAttachment] = React.useState("");
  const getNweets = async () => {
    const querySnapshot = await getDocs(collection(db, "nweets"));
    querySnapshot.forEach((document) => {
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
    if (nweet === "") {
      return;
    }
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
    };
    reader.readAsDataURL(theFile);
  };
  const onClearPhotoClick = () => {
    setAttachment("");
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="factoryForm">
        <div className="factoryInput__container">
          <input
            className="factoryInput__input"
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="What's on your mind?"
            maxLength={120}
          />
          <input type="submit" value="&rarr;" className="factoryInput__arrow" />
        </div>
        <label for="attach-file" className="factoryInput__label">
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{
            opacity: 0,
          }}
        />
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              src={attachment}
              style={{
                backgroundImage: attachment,
              }}
              alt="img"
            />
            <div className="factoryForm__clear" onClick={onClearPhotoClick}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
      <div style={{ marginTop: 30 }}>
        {nweets.map((item) => (
          <Nweet
            key={item.id}
            nweetObj={item}
            isOwner={item.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
