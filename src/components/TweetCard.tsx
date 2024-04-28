import styled from "styled-components";
import { ITweet } from "./Timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: transparent;
  min-height: 100px;
  border-bottom: rgb(47, 51, 54) 1px solid;
  padding: 10px;
`;
const Column = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  .ellipsis {
    font-size: 18px;
    position: absolute;
    right: -5px;
    top: -5px;
    cursor: pointer;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
    padding: 5px;
    &:hover {
      background-color: rgba(29, 155, 240, 0.3);
      color: #1d9bf0;
    }
  }
`;
const Modal = styled.div`
  position: absolute;
  right: 10px;
  top: 5px;
`;
const ModalTrue = styled.div`
  width: 170px;
  border-radius: 15px;
  color: white;
  background-color: black;
  display: flex;
  flex-direction: column;
  position: relative;
  right: -10px;
  top: -5px;
  cursor: pointer;
  padding: 10px 0px;
  box-shadow: 0px 0px 5px gray;
  z-index: 1;
`;
const ModalItem = styled.div`
  padding: 0px 10px;
  background-color: transparent;
  display: flex;
  align-items: center;
  font-weight: 600;
  gap: 8px;
  font-size: 16px;
  padding: 10px 15px;
  transition: 0.2s ease-in-out;
  &:hover {
    opacity: 0.6;
  }
  svg {
    font-size: 20px;
  }
`;
const DeleteItem = styled(ModalItem)`
  color: rgb(228, 60, 68);
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  grid-row-gap: 7px;
`;
const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 7px;
`;
const Username = styled.span`
  font-weight: 700;
`;
const Payload = styled.p`
  font-size: 14px;
`;
const Photo = styled.img`
  height: 440px;
  width: 500px;
  border-radius: 15px;
  margin-top: 15px;
  margin-left: 46px;
`;

export default function TweetCard({
  tweet,
  username,
  photo,
  userId,
  id,
  avatar,
}: ITweet) {
  const [isModal, setIsModal] = useState(false);
  const onClick = () => setIsModal(true);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm(`Are you sure this tweet delete?`);
    if (!ok || user?.uid !== userId) return;
    await deleteDoc(doc(db, "tweets", id));
    if (photo) {
      const photoRef = ref(storage, `tweets/${userId}/${id}`);
      await deleteObject(photoRef);
    }
  };
  const onEdit = async () => {
    const ok = prompt("Are you sure this tweet update?");
    if (!ok || user?.uid !== userId) return;
    await updateDoc(doc(db, "tweets", id), {
      tweet: ok,
    });
    setIsModal(false);
  };
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const exitModal = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsModal(false);
      }
    };
    document.addEventListener("mousedown", exitModal);
    return () => {
      document.removeEventListener("mousedown", exitModal);
    };
  }, [isModal]);
  return (
    <Wrapper>
      <Column>
        <Avatar src={avatar} />
        <Box>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
        </Box>
        {user?.uid === userId && (
          <Modal>
            <IoEllipsisHorizontalSharp onClick={onClick} className="ellipsis" />
            {isModal ? (
              <ModalTrue ref={modalRef}>
                <DeleteItem onClick={onDelete}>
                  <FiTrash2 />
                  <span>Delete</span>
                </DeleteItem>
                <ModalItem onClick={onEdit}>
                  <FiEdit />
                  <span>Edit</span>
                </ModalItem>
              </ModalTrue>
            ) : null}
          </Modal>
        )}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
