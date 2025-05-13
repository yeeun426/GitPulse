import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../common/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import OrganizationPage from "../pages/OrganizationPage";
import ProfilePage from "../pages/ProfilePage";
import DevTypeTest from "../components/dev-type-test";
import NewsPage from "../pages/NewsPage";

export const router = createBrowserRouter([
  {
    path: "/", // 로그인 페이지
    element: <LoginPage />,
  },
  {
    path: "/", // 루트 경로 그대로 유지, 내부 children으로만 분기
    element: <DefaultLayout />,
    errorElement: <div>에러</div>,
    children: [
      {
        path: "/org/:id/:name",
        element: <OrganizationPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "dev-type-test",
        element: <DevTypeTest />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
    ],
  },
]);
