import axios from "axios";
import { User } from "firebase/auth";
import { ICreatePost, IPost } from "../interface/post.interface";

export const fetchPostsFeed = async ({
  user,
  endpoint,
  pageParam,
  search,
}: {
  user: User;
  endpoint: string;
  pageParam: string;
  search?: string;
}) => {
  const params = new URLSearchParams();
  params.append("limit", "5");
  if (pageParam) params.append("lastDocId", pageParam);
  if (search) params.append("query", search);
  const response = await axios.get<{ posts: IPost[]; lastVisibleId: string }>(
    `${endpoint}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    }
  );

  return response?.data;
};

export const addPostFn = async (user: User, newPost: ICreatePost) => {
  return axios.post(
    `${import.meta.env.VITE_API_URL}/posts`,
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
    `${import.meta.env.VITE_API_URL}/posts/${postId}/like`,
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
    `${import.meta.env.VITE_API_URL}/posts/${postId}/dislike`,
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
  await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`, {
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
    `${import.meta.env.VITE_API_URL}/posts/${postId}`,
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
