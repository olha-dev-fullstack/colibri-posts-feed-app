import {
  QueryClientContext,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Post } from "../components/Post";
import { PostForm } from "../components/PostForm";
import { addPostFn, fetchPostsFeed } from "../feature/posts";
import { getUploadLink } from "../firebase/imageUploader";
import { useAuth } from "../hooks/useAuth";
import { ICreatePost } from "../interface/post.interface";
import useDebounce from "../hooks/useDebounce";



export const MyPosts = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const client = useContext(QueryClientContext);
  const [newPost, setNewPost] = useState<ICreatePost>({
    title: "",
    text: "",
    owner: user!.uid,
  });
  const [file, setFile] = useState<File | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      fetchPostsFeed({
        user: user!,
        endpoint: `${import.meta.env.VITE_API_URL}/user/posts`,
        pageParam: pageParam,
        search: debouncedSearch,
      }),
    enabled: !isUserLoading,
    getNextPageParam: (lastPage) => lastPage.lastVisibleId, // Pass cursor for next page
    initialPageParam: "",
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage(); // Load next page when last post comes into view
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    client?.invalidateQueries({ queryKey: ["posts"] });
  }, [user, client]);

  const { mutate } = useMutation({
    mutationFn: (postToCreate: ICreatePost) => addPostFn(user!, postToCreate),
    onSuccess: () => {
      client?.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  useEffect(() => {
    refetch();
  }, [debouncedSearch, refetch]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFile(file || null);
  };

  const addPost = async () => {
    let fileUrl;
    if (file) {
      fileUrl = await getUploadLink(file);
    }
    mutate({ ...newPost, photo: fileUrl });
    setNewPost({ title: "", text: "", owner: "", photo: "" });
    setFile(null);
  };

  // if (isPostsLoading) return <p>Loading....</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <input
        className="w-full mb-2 p-2 border rounded-md"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      ></input>
      <PostForm
        newPost={newPost}
        setNewPost={setNewPost}
        handleImageUpload={handleImageUpload}
        addPost={addPost}
      />

      {/* {posts && <PostsFeed posts={posts} />} */}
      {data &&
        data.pages.map((page, pageNum) =>
          page.posts.map((post, postNum) => (
            <Post
              key={post.id}
              post={post}
              ref={
                pageNum === data.pages.length - 1 &&
                postNum === page.posts.length - 1
                  ? lastPostRef
                  : null
              }
            />
          ))
        )}
    </div>
  );
};
