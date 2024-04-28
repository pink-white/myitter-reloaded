import styled from "styled-components";
import { IoImageOutline } from "react-icons/io5";
import React, { useState } from "react";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { MdClear } from "react-icons/md";

const Wrapper = styled.div`
  width: 600px;
  height: 270px;
  position: absolute;
  top: 100px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  z-index: 110;
  border-radius: 20px;
  background-color: black;
  .exitBtn {
    font-size: 22px;
    position: relative;
    top: 10px;
    left: -7px;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background-color: rgba(169, 169, 169, 0.2);
    }
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 0px 20px;
  height: 100%;
`;
const Box = styled.div`
  display: flex;
`;
const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  margin-right: 7px;
  margin-top: 25px;
`;
const Textarea = styled.textarea`
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 20px;
  background-color: transparent;
  border: none;
  height: 48%;
  margin-top: 30px;
  color: white;
  &:focus {
    outline: none;
  }
`;
const AttachBtn = styled.label`
  cursor: pointer;
  svg {
    color: rgb(29, 155, 240);
    font-size: 23px;
    transition: 0.2s ease-in-out;
    border-radius: 50%;
    padding: 7px;
    &:hover {
      background-color: rgba(29, 155, 240, 0.2);
    }
  }
`;
const AttachInput = styled.input`
  display: none;
`;
const Hr = styled.div`
  width: 100%;
  border: 1px solid rgb(47, 48, 49);
  margin-top: 15px;
  position: relative;
  left: -4px;
`;
const PostBtn = styled.input`
  padding: 10px 20px;
  border-radius: 25px;
  background-color: #1d9bf0;
  font-size: 16px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;
const BtnBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

export default function PostForm({ onExitPost }: { onExitPost: () => void }) {
  const [isLoading, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setTweet(e.target.value);
  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files?.length === 1) {
      return setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (isLoading || !user || tweet === "" || tweet.length > 180) return;
    if (file && file.size > 1 * 1024 * 1024) {
      console.log("too much big file size!");
      return;
    }
    try {
      setLoading(true);
      const newDoc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        avatar: user.photoURL,
      });
      if (file) {
        const locationRef = ref(storage, `tweets/${user.uid}/${newDoc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(newDoc, {
          photo: url,
        });
        setFile(null);
      }
      setTweet("");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      onExitPost();
    }
  };
  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <MdClear onClick={onExitPost} className="exitBtn" />
        <Box>
          <Avatar />
          <Textarea
            value={tweet}
            onChange={onChange}
            rows={5}
            maxLength={180}
            placeholder="What is happening?"
            required
          />
        </Box>
        <Hr />
        <BtnBox>
          <AttachBtn htmlFor="file">
            <IoImageOutline />
          </AttachBtn>
          <AttachInput
            onChange={onChangeFile}
            type="file"
            accept="image/*"
            id="file"
          />
          <PostBtn type="submit" value={isLoading ? "Posting..." : "Post"} />
        </BtnBox>
      </Form>
    </Wrapper>
  );
}
