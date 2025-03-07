import {
  QueryClientContext,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { PostForm } from "../components/PostForm";
import { PostsFeed } from "../components/PostsFeed";
import { addPostFn, fetchPostsFeed } from "../feature/posts";
import { getUploadLink } from "../firebase/imageUploader";
import { useAuth } from "../hooks/useAuth";
import { IPost } from "../interface/post.interface";

export const MyPosts = () => {
  const { user, isLoading } = useAuth();
  const client = useContext(QueryClientContext);
  const [newPost, setNewPost] = useState<IPost>({
    title: "",
    text: "",
    owner: user!.uid,
  });
  const [file, setFile] = useState<File | null>(null);

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["postsFromDb"],
    queryFn: () => fetchPostsFeed(user!, "http://localhost:3000/user/posts"),
    enabled: !isLoading,
  });

  useEffect(() => {
    client?.invalidateQueries({ queryKey: ["postsFromDb"] });
  }, [user, client]);

  const { mutate } = useMutation({
    mutationFn: (postToCreate: IPost) => addPostFn(user!, postToCreate),
    onSuccess: () => {
      client?.invalidateQueries({ queryKey: ["postsFromDb"] });
    },
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
  };

  const addPost = async () => {
    let fileUrl;
    if (file) {
       fileUrl = await getUploadLink(file);
    }
    mutate({...newPost, photo: fileUrl});
    setNewPost({ title: "", text: "", owner: "", photo: "" });
    setFile(null);
  };

  const addComment = (postId: string, comment: string) => {
    // setPosts(
    //   posts.map((post) =>
    //     post.id === postId
    //       ? {
    //           ...post,
    //           comments: [...post.comments, { id: uuidv4(), text: comment }],
    //         }
    //       : post
    //   )
    // );
    return;
  };
  if (isPostsLoading) return <p>Loading....</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <PostForm
        newPost={newPost}
        setNewPost={setNewPost}
        handleImageUpload={handleImageUpload}
        addPost={addPost}
      />

      {posts && <PostsFeed posts={posts} addComment={addComment} />}
    </div>
  );
};
