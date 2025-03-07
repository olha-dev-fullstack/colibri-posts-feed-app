import { useAuth } from "../hooks/useAuth";

export const  Profile = () => {
    const {user, isLoading} = useAuth();

if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>You must be logged in</p>;

  return (
    <div>
      <h1>Welcome, {user.displayName || "User"}!</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
};
