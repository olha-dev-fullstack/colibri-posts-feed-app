import { IPost } from "../interface/post.interface";
import { Post } from "./Post";

export const PostsFeed = ({
  posts,
}: //   addComment,
{
  posts: IPost[];
  addComment: (postId: string, text: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post post={post} />
      ))}
    </div>
  );
};
