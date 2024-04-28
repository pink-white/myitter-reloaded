import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";
import { GoHomeFill } from "react-icons/go";
import { IoSearchOutline } from "react-icons/io5";
import { FaRegBookmark, FaRegUser } from "react-icons/fa";
import { useState } from "react";
import PostForm from "./PostForm";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  a {
    text-decoration: none;
    color: inherit;
  }
`;
const Nav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: fixed;
  top: 10px;
  left: 60px;
`;
const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 10px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border-radius: 30px;
  max-width: 160px;
  &:hover {
    background-color: #1c1b1b;
  }
  svg {
    font-size: 26px;
  }
`;
const NavText = styled.span`
  font-size: 20px;
  font-weight: 300;
`;
const PostBtn = styled.div`
  padding: 18px 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1d9bf0;
  border-radius: 30px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    opacity: 0.7;
  }
`;
const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(65, 63, 63, 0.5);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
`;
const Box = styled.div`
  border: rgb(47, 51, 54) 1px solid;
  width: 600px;
  border-top: none;
  border-bottom: none;
  padding-bottom: 60px;
  position: relative;
  left: -50px;
  height: 100%;
`;

export default function Layout() {
  const [clickedPost, setPost] = useState(false);
  const onClickedPost = () => setPost(true);
  const onExitPost = () => setPost(false);
  return (
    <Wrapper>
      <Nav>
        <Link to="/">
          <NavItem>
            <GoHomeFill />
            <NavText>Home</NavText>
          </NavItem>
        </Link>
        <Link to="/explore">
          <NavItem>
            <IoSearchOutline />
            <NavText>Explore</NavText>
          </NavItem>
        </Link>
        <Link to="/bookmark">
          <NavItem>
            <FaRegBookmark />
            <NavText>Bookmarks</NavText>
          </NavItem>
        </Link>
        <Link to="/profile">
          <NavItem>
            <FaRegUser />
            <NavText>Profile</NavText>
          </NavItem>
        </Link>
        <PostBtn onClick={onClickedPost}>Post</PostBtn>
      </Nav>
      {clickedPost ? (
        <>
          <Overlay onClick={() => setPost(false)}></Overlay>
          <PostForm onExitPost={onExitPost} />
        </>
      ) : null}
      <Box>
        <Outlet />
      </Box>
    </Wrapper>
  );
}
