import {
  QueryClientContext,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { User } from "firebase/auth";
import { useContext } from "react";
import { addCommentFn, fetchComments } from "../feature/comments";
import { IPaginatedPosts } from "../interface/post.interface";

export const CommentsBlock = (props: { postId: string; user: User }) => {
  const { postId, user } = props;
  const client = useContext(QueryClientContext);

  const { data: comments, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
  });

  const { mutate: createCommentMutation } = useMutation({
    mutationFn: (commentText: string) =>
      addCommentFn(postId, user!, commentText),
    onSuccess: (comment) => {
      client?.invalidateQueries({ queryKey: ["comments", comment.postId] });

      client?.setQueryData(["posts"], (old: IPaginatedPosts) => ({
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) =>
            post.id === postId
              ? { ...post, commentsCount: post.commentsCount! + 1 }
              : post
          ),
        })),
      }));
    },
  });

  if (isCommentsLoading) return "Loading...";

  return (
    <div className="border-t pt-2 space-y-2">
      {user && (
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          placeholder="Write a comment..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              createCommentMutation(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      )}
      {comments!.map((comment) => (
        <div key={comment.id} className="text-sm bg-gray-100 p-2 rounded-md">
          <h4 className="font-bold">{comment.username}</h4>
          {comment.text}
        </div>
      ))}
    </div>
  );
};
