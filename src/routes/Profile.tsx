import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { getDownloadURL, ref } from "firebase/storage";

import { ITweet } from "../components/Timeline";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import TweetCard from "../components/TweetCard";
import { FaArrowLeft } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";

const Wrapper = styled.div``;
const Heder = styled.div`
  padding-left: 15px;
  height: 60px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0px;
  gap: 30px;
  z-index: 1;
  border-bottom: rgb(47, 51, 54) 1px solid;
  background-color: black;
  svg {
    font-size: 20px;
    cursor: pointer;
  }
`;
const HeaderBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  h1 {
    font-size: 18px;
    font-weight: 600;
  }
  span {
    font-size: 14px;
    color: gray;
  }
`;
const UserInfo = styled.div`
  height: 470px;
  display: flex;
  flex-direction: column;
  border-bottom: rgb(47, 51, 54) 1px solid;
`;
const BackgroundImg = styled.div<{ $bgImg: string | null }>`
  background: url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  height: 200px;
  background-color: darkgray;
`;
const UserEditBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
`;
const EditBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 105px;
  height: 35px;
  border-radius: 20px;
  background-color: black;
  border: darkgray 1px solid;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  &:hover {
    opacity: 0.7;
  }
`;

const AvatarImg = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  position: relative;
  top: -85px;
`;

const UserExtraInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding-left: 15px;
  position: relative;
  top: -65px;
`;
const Username = styled.span`
  font-weight: 700;
  font-size: 20px;
`;
const Description = styled.p`
  font-size: 15px;
  color: #a3a1a1;
`;

const Tweets = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [userInfoLoading, setUserInfoLoading] = useState(true);
  const [tweetLoading, setTweetLoading] = useState(true);
  const [bgImg, setBgImg] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fetchUserInfo = async () => {
    const userDoc = await getDoc(
      doc(collection(db, "userAdditionalInfo"), user?.uid)
    );
    const userData = userDoc.data();
    if (userData) {
      if (userData.bgUrl) {
        setBgImg(userData.bgUrl);
      }
      if (userData.description) {
        setDescription(userData.description);
      }
    }
    setUserInfoLoading(false);
  };
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetQuery = query(
      collection(db, "tweets"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(tweetQuery);
    const tweets = snapshot.docs.map((doc) => {
      const { tweet, createdAt, username, userId, photo, avatar } = doc.data();
      return {
        tweet,
        createdAt,
        username,
        userId,
        id: doc.id,
        photo,
        avatar,
      };
    });
    setTweets(tweets);
    return setTweetLoading(false);
  };
  useEffect(() => {
    fetchTweets();
    fetchUserInfo();
  }, []);
  /*   const fetchBgUrl = async () => {
    try {
      const bgRef = ref(storage, `background/${user?.uid}`);
      const url = await getDownloadURL(bgRef);
      return url;
    } catch (error) {
      console.error("bg 이미지 URL을 가져오는 중 오류 발생:", error);
      return null;
    }
  }; */
  const [avatar] = useState(user?.photoURL ? user.photoURL : null);
  const nav = useNavigate();
  const onEditClick = () => {
    nav("/profile/edit");
  };

  return (
    <Wrapper>
      <Heder>
        <FaArrowLeft />
        <HeaderBox>
          <h1>{user?.displayName || "Anonymous"}</h1>
          <span>
            {tweets.length === 0
              ? `${tweets.length} post`
              : `${tweets.length} posts`}
          </span>
        </HeaderBox>
      </Heder>
      {userInfoLoading ? (
        <span>Loading</span>
      ) : (
        <UserInfo>
          <BackgroundImg $bgImg={bgImg} />
          <UserEditBox>
            {avatar && <AvatarImg src={avatar} />}
            {avatar === null && <FaUserCircle />}
            <EditBtn onClick={onEditClick}>Edit profile</EditBtn>
          </UserEditBox>
          <UserExtraInfo>
            <Username>{user?.displayName || "Anonymous"}</Username>
            <Description>{description || "소개글이 없습니다."}</Description>
          </UserExtraInfo>
        </UserInfo>
      )}
      {tweetLoading ? (
        <span>Loading</span>
      ) : (
        <Tweets>
          {tweets
            ? /*  (tweets.length === 0 && (
              <span>{description ? description : "소개글이 없습니다."}</span>
            )) || */
              tweets.map((tweet) => <TweetCard key={tweet.id} {...tweet} />)
            : null}
        </Tweets>
      )}
      <Outlet />
    </Wrapper>
  );
}
