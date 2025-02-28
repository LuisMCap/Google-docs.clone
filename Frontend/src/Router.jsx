import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./ErrorPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Documents from "./pages/Documents";
import ProtectedRoute from "./components/ProtectedApiRoutes.jsx/ProtectedRoute"
import CreateDocument from "./pages/CreateDocument";
import DocumentCont from "./pages/DocumentCont";
import About from "./pages/About";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/document/:documentID",
          element: (
            <ProtectedRoute>
              <DocumentCont />
            </ProtectedRoute>
          ),
        },
        {
          path: "login",
          element: (
            <Home>
              <Login />
            </Home>
          ),
        },
        {
          path: "register",
          element: (
            <Home>
              <Register />
            </Home>
          ),
        },
        {
          path: "/documents",
          element: (
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          ),
        },
        {
          path: "/documents/createDocument",
          element: (
            <ProtectedRoute>
              <Documents>
                <CreateDocument />
              </Documents>
            </ProtectedRoute>
          ),
        },
        {
          path: '/about',
          element: (
            <About/>
          )
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
