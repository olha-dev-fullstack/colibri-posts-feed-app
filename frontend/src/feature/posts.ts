import axios from "axios";
import { User } from "firebase/auth";
import { IPost } from "../interface/post.interface";

export const fetchPostsFeed = async (user: User, endpoint: string) => {
  const response = await axios.get<IPost[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });
  console.log("123", response);

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
