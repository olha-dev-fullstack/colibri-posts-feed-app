import { IPost } from "../interface/post.interface";

export const PostsFeed = ({
  posts,
//   addComment,
}: {
  posts: IPost[];
  addComment: (postId: string, text: string) => void;
}) => {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white shadow-md rounded-md">
          {post.photo && (
              <img src={post.photo} alt="Post" className="w-full h-48 rounded-md object-contain" />
            )}
            <h2>{post.title}</h2>
            <p>{post.text}</p>
          {/* <div className="border-t pt-2 space-y-2"> */}
          {/* <input
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    addComment(post.id, e.target.value);
                    e.target.value = "";
                  }
                }}
              /> */}
          {/* {post.comments && post.comments.map((comment) => (
                <p key={comment.id} className="text-sm bg-gray-100 p-2 rounded-md">
                  {comment.text}
                </p>
              ))}
            </div> */}
        </div>
      ))}
    </div>
  );
};
