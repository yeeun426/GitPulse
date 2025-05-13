import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "../common/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import OrganizationPage from "../pages/OrganizationPage";
import ProfilePage from "../pages/ProfilePage";
import DevTypeTest from "../components/dev-type-test"; // ✅ 파일 이름 주의
import IntroPage from "../components/IntroPage"; // ✅ 인트로 페이지 추가

export const router = createBrowserRouter([
  {
    path: "/", // 로그인 페이지
    element: <LoginPage />,
  },
  {
    path: "/", // 루트 경로 그대로 유지
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
        path: "dev-type-test", // 기존 테스트 페이지
        element: <DevTypeTest />,
      },
      {
        path: "test", // ✅ 인트로 페이지 경로
        element: <IntroPage />,
      },
      {
        path: "teststart", // ✅ 실제 테스트 시작 페이지
        element: <DevTypeTest />, // 중복되지만 경로 분기 가능
      },
    ],
  },
]);
