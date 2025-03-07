import { QueryClientContext, useQuery } from "@tanstack/react-query";
import { ChangeEvent, ChangeEventHandler, useContext, useEffect } from "react";
import { PostsFeed } from "../components/PostsFeed";
import { useAuth } from "../hooks/useAuth";
import { fetchPostsFeed } from "../feature/posts";
import { getUploadLink } from "../firebase/imageUploader";

const Home = () => {
  const { user, isLoading } = useAuth();
  const client = useContext(QueryClientContext);
  // const [newPost, setNewPost] = useState({ text: "", image: null });

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["postsFromDb"],
    queryFn: () => fetchPostsFeed(user!, "http://localhost:3000/posts"),
    enabled: !isLoading,
  });

  useEffect(() => {
    client?.invalidateQueries({ queryKey: ["postsFromDb"] });
  }, [user, client]);



  // const addPost = () => {
  //   if (!newPost.text.trim()) return;
  //   setPosts([{ id: uuidv4(), ...newPost, comments: [] }, ...posts]);
  //   setNewPost({ text: "", image: null });
  // };

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
      {/* <PostForm
        newPost={newPost}
        setNewPost={setNewPost}
        handleImageUpload={handleImageUpload}
        addPost={addPost}
      /> */}

      {posts && <PostsFeed posts={posts} addComment={addComment} />}
    </div>
  );
};

export default Home;
