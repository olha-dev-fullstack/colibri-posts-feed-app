import { ChangeEvent } from "react";
import { ICreatePost } from "../interface/post.interface";

type PostProps = {
  newPost: ICreatePost;
  setNewPost: (post: ICreatePost) => void;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  addPost: () => void;
};

export const PostForm = (props: PostProps) => {
  const { newPost, setNewPost, handleImageUpload, addPost } = props;

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <input
        className="w-full mb-2 p-2 border rounded-md"
        placeholder="Title"
        value={newPost.title}
        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
      />
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="What's happening?"
        value={newPost.text}
        onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="mt-2"
      />
      <button
        onClick={addPost}
        className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Tweet
      </button>
    </div>
  );
};
