import { QueryClientContext, useMutation } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { deletePostFn, dislikePostFn, likePostFn } from "../feature/posts";
import { useAuth } from "../hooks/useAuth";
import { IPost } from "../interface/post.interface";
import { CommentsBlock } from "./CommentsBlock";

export const Post = ({ post }: { post: IPost }) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const client = useContext(QueryClientContext);
  const [showComments, setShowComments] = useState(false);

  const { mutate: likePostMutation } = useMutation({
    mutationFn: async (postId: string) => likePostFn(user!, postId),
    onSuccess: (updatedPost) => {
      client?.setQueryData(["postsFromDb"], (oldPosts: IPost[]) => {
        return oldPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
      });
    },
  });

  const { mutate: dislikePostMutation } = useMutation({
    mutationFn: async (postId: string) => dislikePostFn(user!, postId),
    onSuccess: (updatedPost) => {
      client?.setQueryData(["postsFromDb"], (oldPosts: IPost[]) => {
        return oldPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        );
      });
    },
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: async (postId: string) => deletePostFn(user!, postId),
    onSuccess: () => {
      client?.invalidateQueries({ queryKey: ["postsFromDb"] });
    },
  });

  const handleLike = (postId: string) => {
    likePostMutation(postId);
  };

  const handleDislike = (postId: string) => {
    dislikePostMutation(postId);
  };

  const handleDelete = (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePostMutation(postId);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <p className="text-gray-600 text-sm">
        {post?.createdAt?.toLocaleString()} {/* Display formatted date */}
      </p>
      <h3 className="text-lg">{post.title}</h3>
      <p className="text-md">{post.text}</p>
      {post.photo && (
        <img src={post.photo} alt="Post" className="w-full rounded-md mt-2" />
      )}

      {/* Like & Dislike Buttons */}
      <div className="flex justify-between space-x-4 mt-2">
        <button onClick={() => handleLike(post.id)} className="text-blue-500">
          👍 {post.likesCount}
        </button>
        <button onClick={() => handleDislike(post.id)} className="text-red-500">
          👎 {post.dislikesCount}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-500"
        >
          💬 {post.commentsCount}
        </button>
        {userId === post.owner && (
          <div className="flex justify-between">
            <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-2">
              Edit
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 border border-red-500 rounded shadow m-2"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Comment Input */}
      {showComments ? <CommentsBlock postId={post.id} user={user!} /> : null}
    </div>
  );
};
