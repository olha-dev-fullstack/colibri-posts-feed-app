import { useAuth } from "../hooks/useAuth";

export const MyPosts = () => {
  const { user } = useAuth();
  // user?.getIdToken

  return <div>MyPosts</div>;
};
