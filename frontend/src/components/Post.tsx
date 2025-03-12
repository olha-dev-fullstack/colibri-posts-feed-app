import { QueryClientContext, useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import {
  deletePostFn,
  dislikePostFn,
  likePostFn,
  updatePostFn,
} from "../feature/posts";
import { getUploadLink } from "../firebase/imageUploader";
import { useAuth } from "../hooks/useAuth";
import {
  ICreatePost,
  IPaginatedPosts,
  IPost,
} from "../interface/post.interface";
import { CommentsBlock } from "./CommentsBlock";

export const Post = ({
  post,
  ref,
}: {
  post: IPost;
  ref: null | ((node: HTMLDivElement) => void);
}) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const client = useContext(QueryClientContext);
  const [showComments, setShowComments] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedText, setEditedText] = useState(post.text);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(post.photo);

  const { mutate: likePostMutation } = useMutation({
    mutationFn: async (postId: string) => likePostFn(user!, postId),
    onSuccess: (updatedPost) => {
      client?.setQueryData(["posts"], (oldPosts: IPaginatedPosts) => {
        oldPosts.pages.forEach((page) => {
          page.posts.forEach((post) => {
            if (post.id === updatedPost.id) {
              Object.assign(post, updatedPost);
            }
          });
        });
        return oldPosts;
      });
    },
  });

  const { mutate: dislikePostMutation } = useMutation({
    mutationFn: async (postId: string) => dislikePostFn(user!, postId),
    onSuccess: (updatedPost) => {
      client?.setQueryData(["posts"], (oldPosts: IPaginatedPosts) => {
        oldPosts.pages.forEach((page) => {
          page.posts.forEach((post) => {
            if (post.id === updatedPost.id) {
              Object.assign(post, updatedPost);
            }
          });
        });
        return oldPosts;
      });
    },
  });

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: async (postId: string) => deletePostFn(user!, postId),
    onSuccess: () => {
      client?.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: updatePostMutation } = useMutation({
    mutationFn: async ({
      postId,
      postData,
    }: {
      postId: string;
      postData: Partial<ICreatePost>;
    }) => updatePostFn(user!, { postId, postData }),
    onSuccess: (updatedPost) => {
      client?.setQueryData(["posts"], (oldPosts: IPaginatedPosts) => {
        oldPosts.pages.forEach((page) => {
          page.posts.forEach((post) => {
            if (post.id === updatedPost.id) {
              Object.assign(post, updatedPost);
            }
          });
        });
        return oldPosts;
      });
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setEditedImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview selected image
    }
  };

  const handleSave = async (postId: string) => {
    let fileUrl;
    if (editedImage) {
      fileUrl = await getUploadLink(editedImage);
    }
    updatePostMutation({
      postId,
      postData: {
        title: editedTitle,
        text: editedText,
        photo: fileUrl,
      },
    });
    setIsEditing(false);
  };
  useEffect(() => {console.log(post);
  }, [post])

  return (
    <div className="p-4 bg-white shadow-md rounded-md" ref={ref}>
      <p className="text-gray-600 text-sm">
        {post?.createdAt?.toLocaleString()} {/* Display formatted date */}
      </p>
      {isEditing ? (
        <>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            className="w-full p-2 border rounded-md mt-2"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full rounded-md mt-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </>
      ) : (
        <>
          <h3 className="text-lg">{post.title}</h3>
          <p className="text-md">{post.text}</p>
          {post.photo && (
            <img
              src={post.photo}
              alt="Post"
              className="w-full rounded-md mt-2"
            />
          )}
        </>
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
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(post.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md rounded shadow m-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded shadow m-2"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow m-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 border border-red-500 rounded shadow m-2"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Comment Input */}
      {showComments ? <CommentsBlock postId={post.id} user={user!} /> : null}
    </div>
  );
};
