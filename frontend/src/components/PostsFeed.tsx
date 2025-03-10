import { IPost } from "../interface/post.interface";
import { Post } from "./Post";

export const PostsFeed = ({
  posts,
}:
{
  posts: IPost[];

}) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
