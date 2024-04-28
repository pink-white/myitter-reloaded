import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/AuthStyles";
import GitHubBtn from "../components/GitHubBtn";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";

export default function Join() {
  const nav = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading || name === "" || email === "" || password === "") return;
    try {
      setLoading(true);
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(
        doc(collection(db, "userAdditionalInfo"), credential.user.uid),
        {
          avatarImg: "",
          bgImg: "",
          description: "",
          bookmarks: "",
          userId: credential.user.uid,
        }
      );
      await updateProfile(credential.user, { displayName: name });
      nav("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.code);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>Join 𝕏</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          type="text"
          value={name}
          name="name"
          placeholder="Name"
          required
        />
        <Input
          onChange={onChange}
          type="email"
          value={email}
          name="email"
          placeholder="Email"
          required
        />
        <Input
          onChange={onChange}
          type="password"
          value={password}
          name="password"
          placeholder="Password"
          required
        />
        <Input type="submit" value={isLoading ? "Loading..." : "Submit"} />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <GitHubBtn />
      <Switcher>
        Already have an account? <Link to="/login">Login now &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
