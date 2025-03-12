import { useAuth } from "../hooks/useAuth";

export const Profile = () => {
  const { user, dbUser, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in</p>;

  return (
    <div>
      <h1>Welcome, {dbUser?.username || "User"}!</h1>
      Email: {dbUser?.email}
    </div>
  );
};
