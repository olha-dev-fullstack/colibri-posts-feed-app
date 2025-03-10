import axios from "axios";
import { User } from "firebase/auth";
import { IPost } from "../interface/post.interface";

export const fetchPostsFeed = async (user: User, endpoint: string) => {
  const response = await axios.get<IPost[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });

  return response?.data;
};

export const addPostFn = async (user: User, newPost: IPost) => {
  return axios.post(
    "http://localhost:3000/posts",
    {
      ...newPost,
    },
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );
};

export const likePostFn = async (user: User, postId: string) => {
  const response = await  axios.post<IPost>(`http://localhost:3000/posts/${postId}/like`, {}, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });
  return response?.data;

};

export const dislikePostFn = async (user: User, postId: string) => {
  const response = await  axios.post<IPost>(`http://localhost:3000/posts/${postId}/dislike`, {}, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });
  return response?.data;

};
