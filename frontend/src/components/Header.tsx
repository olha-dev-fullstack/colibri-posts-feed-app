import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Header = () => {
  const { user, logOut } = useAuth();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="text-xl font-bold">Colibri Feed</div>
      <nav className="space-x-4">
        <button
          className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => navigate("/feed")}
        >
          Feed
        </button>
        {user && (
          <button
            className="bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => navigate("/my-posts")}
          >
            My Posts
          </button>
        )}
      </nav>
      {user ? (
        <div
          onMouseEnter={() => setIsMenuVisible(true)}
          onMouseLeave={() => setIsMenuVisible(false)}
        >
          <button
            className="w-10 h-10"
          >
            {user.photoURL && <img src={user.photoURL} className="rounded-full contained"/>}
          </button>
          {isMenuVisible && (
            <div className="absolute right-0 w-40 bg-white shadow-md rounded-md">
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full text-gray-500"
                onClick={() => navigate("/profile")}
              >
                Profile
              </button>
              <button
                className="block px-4 py-2 hover:bg-gray-100 w-full text-red-500"
                onClick={() => logOut()}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex">
          <button
            className="block px-4 py-2 hover:bg-gray-500"
            onClick={() => navigate("/sign-up")}
          >
            Sign up
          </button>
          <button
            className="block px-4 py-2 hover:bg-gray-500"
            onClick={() => navigate("/sign-in")}
          >
            Log in
          </button>
        </div>
      )}
    </div>
  );
};
