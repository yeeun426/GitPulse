import React from "react";
import { useNavigate } from "react-router-dom";
import css from "./IntroPage.module.css";
import logoImage from "../assets/icon_mini.png"; // 이미지 파일 경로 확인!

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/teststart"); // 테스트 페이지 경로로 이동
  };

  return (
    <div className={css.container}>
      <h1 className={css.title}>개발자 유형 테스트</h1>
      <div className={css.logoWrapper}>
        <img src={logoImage} alt="GitPulse Logo" className={css.logo} />
      </div>
      <p className={css.subtitle}>나의 개발자 유형과 숨겨진 능력은 ?</p>
      <button className={css.startButton} onClick={handleStart}>
        테스트 시작하기
      </button>
    </div>
  );
};

export default IntroPage;
