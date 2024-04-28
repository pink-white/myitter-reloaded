import styled from "styled-components";
import { auth } from "../firebase";
import Timeline from "../components/Timeline";

const Wrapper = styled.div``;

export default function Home() {
  const logOut = () => auth.signOut();
  return (
    <Wrapper>
      <Timeline />
      <button onClick={logOut}>12</button>
    </Wrapper>
  );
}
