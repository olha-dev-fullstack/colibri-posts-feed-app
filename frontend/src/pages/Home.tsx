import { QueryClientContext, useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useContext, useEffect, useRef } from "react";
import { Post } from "../components/Post";
import { fetchPostsFeed } from "../feature/posts";
import { useAuth } from "../hooks/useAuth";

const Home = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const client = useContext(QueryClientContext);

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam }) =>
        fetchPostsFeed({
          user: user!,
          endpoint: "http://localhost:3000/posts",
          pageParam: pageParam,
        }),
        enabled: !isUserLoading,
      getNextPageParam: (lastPage) => lastPage.lastVisibleId, // Pass cursor for next page
      initialPageParam: "",
    });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement| null) => {      
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

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div className="space-y-4">
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
      {isFetchingNextPage && <p className="text-center mt-4">Loading more...</p>}
    </div>
  );
};

export default Home;
