import axios from "axios";
import { User } from "firebase/auth";
import { ICreatePost, IPost } from "../interface/post.interface";

export const fetchPostsFeed = async (user: User, endpoint: string) => {
  const response = await axios.get<IPost[]>(endpoint, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });

  return response?.data;
};

export const addPostFn = async (user: User, newPost: ICreatePost) => {
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
  const response = await axios.post<IPost>(
    `http://localhost:3000/posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );
  return response?.data;
};

export const dislikePostFn = async (user: User, postId: string) => {
  const response = await axios.post<IPost>(
    `http://localhost:3000/posts/${postId}/dislike`,
    {},
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );
  return response?.data;
};

export const deletePostFn = async (user: User, postId: string) => {
  await axios.delete(`http://localhost:3000/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${await user?.getIdToken()}`,
    },
  });
};

export const updatePostFn = async (
  user: User,
  { postId, postData }: { postId: string; postData: Partial<ICreatePost> }
) => {
  const response = await axios.put<IPost>(
    `http://localhost:3000/posts/${postId}`,
    {
      ...postData,
    },
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );
  return response?.data;
};
