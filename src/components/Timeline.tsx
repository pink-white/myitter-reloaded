import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import styled from "styled-components";
import TweetCard from "./TweetCard";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
  createdAt: number;
  tweet: string;
  username: string;
  userId: string;
  id: string;
  photo?: string;
  avatar: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Timeline() {
  const [tweets, setTweets] = useState<ITweet[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, "tweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      /*  const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, username, userId, photo } = doc.data();
          return {
            tweet,
            createdAt,
            username,
            userId,
            id: doc.id,
            photo,
          };
        }); */
      unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, username, userId, photo, avatar } =
            doc.data();
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
        return setTweets(tweets);
      });
    };
    fetchTweets();
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {tweets
        ? tweets.map((tweet) => <TweetCard key={tweet.id} {...tweet} />)
        : null}
    </Wrapper>
  );
}
