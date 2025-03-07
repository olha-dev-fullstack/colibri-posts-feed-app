import { QueryClientContext, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { PostsFeed } from "../components/PostsFeed";
import { useAuth } from "../hooks/useAuth";
import { IPost } from "../interface/post.interface";

const Home = () => {
  const { user, isLoading } = useAuth();
  const client = useContext(QueryClientContext);
  // const [newPost, setNewPost] = useState({ text: "", image: null });

  const fetchPosts = async () => {
    const response = await axios.get<IPost[]>("http://localhost:3000/posts", {
      headers: {
        Authorization: `Bearer ${await user?.getIdToken()}`,
      },
    });
    console.log("123", response);

    return response?.data;
  };

  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["postsFromDb"],
    queryFn: fetchPosts,
    enabled: !isLoading,
  });

  useEffect(() => {
    client?.invalidateQueries({ queryKey: ["postsFromDb"] });
  }, [user, client]);

  // const handleImageUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setNewPost({ ...newPost, image: reader.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

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
