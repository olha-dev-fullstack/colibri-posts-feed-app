import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";
import Home from "./pages/Home";
import { MyPosts } from "./pages/MyPosts";
import { Profile } from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuth();
  if (isLoading) return <p>Loading...</p>;
  return (
    <>
      <Header />
      {children}
    </>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <p>Loading...</p>;
  return user ? (
    <>
      <Header />
      {children}
    </>
  ) : (
    <SignIn />
  );
};

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="feed"
            element={
              <>
                <PublicRoute>
                  {/* <Header /> */}
                  <Home />
                </PublicRoute>
              </>
            }
          />
          <Route
            path="my-posts"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
