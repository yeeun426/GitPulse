import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./IntroPage.module.css";
import logoImage from "../assets/icon_mini.png"; // 이미지 파일 경로 확인!

const IntroPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/dev-type-test"); // 테스트 페이지 경로로 이동
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>개발자 유형 테스트</h1>
      <img src={logoImage} alt="GitPulse Logo" className={styles.logo} />
      <p className={styles.subtitle}>나의 개발자 유형과 숨겨진 능력은 ?</p>
      <button className={styles.startButton} onClick={handleStart}>
        개발자 유형 알아보기
      </button>
    </div>
  );
};

export default IntroPage;
