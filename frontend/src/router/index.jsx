import { createBrowserRouter } from "react-router-dom";
import { DefaultLayout } from "../common/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import OrganizationPage from "../pages/OrganizationPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "/org/:id/:name",
        element: <OrganizationPage />,
      },
    ],
  },
]);
