import { FC } from "react";
import { useAuth } from "./hooks/use-auth.tsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ShowsPage from "./pages/shows-page.tsx";
// import MovieScreen from "./pages/Movies-page.tsx";
import LoginPage from "./pages/login-page.tsx";
import { AuthProvider } from "./context/auth-context.tsx";
import HomePage from "./pages/home-page.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HomePage />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/shows",
        element: <ShowsPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
]);

const App: FC = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    console.log("you're not authenticated!");
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default App;
