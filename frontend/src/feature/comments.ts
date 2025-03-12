import axios from "axios";
import { User } from "firebase/auth";
import { IComment } from "../interface/comment.interface";

export const fetchComments = async (postId: string) => {
  const response = await axios.get<IComment[]>(
    `http://localhost:3000/posts/${postId}/comments`
  );

  return response?.data;
};

export const addCommentFn = async (
  postId: string,
  user: User,
  commentText: string
) => {
  const response = await axios.post<IComment>(
    `http://localhost:3000/posts/${postId}/comments`,
    {
      text: commentText,
    },
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );
  return response?.data;
};
