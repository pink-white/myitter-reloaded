import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { VscGithubInverted } from "react-icons/vsc";
import styled from "styled-components";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const Btn = styled.span`
  margin-top: 40px;
  background-color: white;
  color: black;
  margin-bottom: 10px;
  padding: 12px 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 70px;
  gap: 5px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  svg {
    font-size: 23px;
  }
  &:hover {
    opacity: 0.7;
  }
`;

export default function GitHubBtn() {
  const nav = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      const user = auth.currentUser;
      const userQuery = query(
        collection(db, "userAdditionalInfo"),
        where("github", "==", true)
      );
      console.log("user", userQuery);
      const querySnapshot = await getDocs(userQuery);
      const snapshotUid = querySnapshot.docs.map((doc) => doc.id);
      if (user && !snapshotUid.includes(user.uid)) {
        await setDoc(doc(collection(db, "userAdditionalInfo"), user?.uid), {
          avatarUrl: "",
          bgUrl: "",
          description: "",
          bookmarks: "",
          userId: user?.uid,
          github: true,
        });
      }
      nav("/");
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Btn onClick={onClick}>
      <VscGithubInverted />
      Continue with GitHub
    </Btn>
  );
}
