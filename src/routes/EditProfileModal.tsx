import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { MdClear } from "react-icons/md";
import { auth, db, storage } from "../firebase";
import { FaUserCircle } from "react-icons/fa";
import { TbCameraPlus } from "react-icons/tb";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

const Wrapper = styled.div``;

const Overlay = styled.div`
  height: 100%;
  width: 100%;
  background-color: rgba(65, 63, 63, 0.5);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
`;
const Form = styled.form`
  width: 580px;
  height: 580px;
  background-color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  position: fixed;
  top: 70px;
  left: 0px;
  right: 0px;
  margin: 0 auto;
  z-index: 110;
  border-radius: 20px;
  padding: 10px 15px;
`;
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const Box = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  svg {
    font-size: 22px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    border-radius: 50%;
    padding: 5px;
    &:hover {
      background-color: rgba(169, 169, 169, 0.2);
    }
  }
`;
const Title = styled.h1`
  font-size: 21px;
  font-weight: 600;
`;
const SaveBtn = styled.button`
  background-color: white;
  padding: 9px 15px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  border: none;
  &:hover {
    opacity: 0.7;
  }
`;
const BackgroundImg = styled.div<{ $bgImg: string | null | undefined }>`
  width: 104%;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(${(props) => props.$bgImg});
  background-size: 100% 100%;
  svg {
    padding: 9px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    font-size: 22px;
  }
`;
const BackgroundInput = styled.input`
  display: none;
`;
const BackgroundLabel = styled.label`
  cursor: pointer;
  z-index: 100;
  transition: 0.2 ease-in-out;
  &:hover {
    opacity: 0.7;
  }
`;
const AvatarBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 10px;
  top: 200px;
  .userSvg {
    width: 120px;
    height: 120px;
    fill: gray;
  }
  .camera {
    position: relative;
    left: -75px;
    font-size: 22px;
    padding: 9px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    font-size: 22px;
  }
`;
const AvatarInput = styled.input`
  display: none;
`;
const AvatarLabel = styled.label`
  cursor: pointer;
  transition: 0.2 ease-in-out;
  &:hover {
    opacity: 0.7;
  }
`;
const Avatar = styled.div<{ $avatar: string | null }>`
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: url(${(props) => props.$avatar});
  background-size: 100% 100%;
  background-color: rgba(0, 0, 0, 0.2);
  svg {
    padding: 9px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    font-size: 22px;
  }
`;
const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3px 10px;
  border: rgb(66, 72, 76) 1px solid;
  width: 90%;
  transition: 0.1s linear;
  background-color: black;
  border-radius: 5px;
  margin-bottom: 20px;
  position: relative;
  bottom: -60px;
  gap: 7px;
`;
const Placeholder = styled.span`
  font-size: 13px;
  position: relative;
  bottom: -5px;
  transition: 0.1s linear;
  color: rgb(113, 119, 124);
`;
const Textarea = styled.textarea`
  color: white;
  width: 100%;
  background-color: transparent;
  position: relative;
  bottom: -3px;
  border: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 16px;
  resize: none;
  overflow-y: hidden;
  &:focus {
    outline: none;
  }
`;

interface IForm {
  backgroundInput?: File;
  avatarInput?: File;
  name?: string;
  description?: string;
}

export default function EditProfileModal() {
  const [isLoading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bgImg, setBgImg] = useState<string | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
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
  };
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    fetchUserInfo();
    setLoading(false);
  }, []);
  const user = auth.currentUser;
  const nav = useNavigate();
  const onExitModal = () => {
    document.body.style.overflowY = "auto";
    nav("/profile");
  };
  const { register, handleSubmit } = useForm();
  const [avatarImg, setAvatarImg] = useState<string | null>(
    user?.photoURL ? user.photoURL : null
  );
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        setAvatarImg(e.currentTarget?.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const onBgImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      setBgFile(file);
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        setBgImg(e.currentTarget?.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async ({
    backgroundInput,
    avatarInput,
    name,
    description,
  }: IForm) => {
    if (!user || (!backgroundInput && !avatarInput && !name && !description))
      return;
    if (backgroundInput && bgFile) {
      const locationRef = ref(storage, `background/${user.uid}`);
      const result = await uploadBytes(locationRef, bgFile);
      const bgUrl = await getDownloadURL(result.ref);
      updateDoc(doc(db, "userAdditionalInfo", user.uid), {
        bgUrl: bgUrl,
      });
    }
    if (avatarInput && avatarFile) {
      const locationRef = ref(storage, `avatar/${user.uid}`);
      const result = await uploadBytes(locationRef, avatarFile);
      const avatarUrl = await getDownloadURL(result.ref);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
    if (name) {
      await updateProfile(user, {
        displayName: name,
      });
    }
    if (description) {
      await updateDoc(doc(db, "userAdditionalInfo", user.uid), {
        description: description,
      });
    }
    onExitModal();
  };
  const inputContainerClick = (e: any) => {
    const container = document.querySelector(".container") as HTMLElement;
    const placeholder = document.querySelector(".placeholder") as HTMLElement;
    const name = document.getElementById("name") as HTMLElement;
    const container2 = document.querySelector(".container2") as HTMLElement;
    const placeholder2 = document.querySelector(".placeholder2") as HTMLElement;
    const description = document.getElementById("description") as HTMLElement;
    if (
      e.target === container ||
      e.target === placeholder ||
      e.target === name
    ) {
      container.style.border = "#1d9bf0 1px solid";
      placeholder.style.color = "#1d9bf0";
      name.focus();
    } else {
      container2.style.border = "#1d9bf0 1px solid";
      placeholder2.style.color = "#1d9bf0";
      description.focus();
    }
  };
  const onBlur = (e: any) => {
    const container = document.querySelector(".container") as HTMLElement;
    const placeholder = document.querySelector(".placeholder") as HTMLElement;
    const name = document.getElementById("name") as HTMLElement;
    const container2 = document.querySelector(".container2") as HTMLElement;
    const placeholder2 = document.querySelector(".placeholder2") as HTMLElement;
    placeholder.style.color = "rgb(113, 119, 124)";
    if (e.target === name) {
      container.style.border = "rgb(47, 51, 54) 1px solid";
      placeholder.style.color = "rgb(113, 119, 124)";
    } else {
      container2.style.border = "rgb(47, 51, 54) 1px solid";
      placeholder2.style.color = "rgb(113, 119, 124)";
    }
  };
  return (
    <Wrapper>
      <Overlay />
      {isLoading ? (
        <span>Loading</span>
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>
            <Box>
              <MdClear onClick={onExitModal} />
              <Title>Edit profile</Title>
            </Box>
            <SaveBtn>Save</SaveBtn>
          </ModalHeader>
          <BackgroundImg $bgImg={bgImg}>
            <BackgroundInput
              {...register("backgroundInput")}
              id="backgroundImg"
              type="file"
              accept="image/*"
              onChange={onBgImgChange}
            />
            <BackgroundLabel htmlFor="backgroundImg">
              <TbCameraPlus />
            </BackgroundLabel>
          </BackgroundImg>
          <AvatarBox>
            {avatarImg ? (
              <Avatar $avatar={avatarImg} />
            ) : (
              <FaUserCircle className="userSvg" />
            )}
            <AvatarInput
              {...register("avatarInput")}
              id="avatar"
              type="file"
              accept="image/*"
              onChange={onAvatarChange}
            />
            <AvatarLabel htmlFor="avatar">
              <TbCameraPlus className="camera" />
            </AvatarLabel>
          </AvatarBox>
          <InputContainer
            className="container"
            onClick={inputContainerClick}
            onBlur={onBlur}
          >
            <Placeholder className="placeholder">Name</Placeholder>
            <Textarea
              id="name"
              {...register("name", {
                minLength: 2,
                maxLength: 15,
                value: `${user?.displayName}`,
              })}
            />
          </InputContainer>
          <InputContainer
            className="container2"
            onClick={inputContainerClick}
            onBlur={onBlur}
          >
            <Placeholder className="placeholder2">Description</Placeholder>
            <Textarea
              id="description"
              {...register("description", {
                minLength: 2,
                maxLength: 160,
              })}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </InputContainer>
        </Form>
      )}
    </Wrapper>
  );
}
