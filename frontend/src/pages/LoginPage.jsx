import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import git from "../assets/Git.png";
import styles from "./LoginPage.module.css";
import LogoutBtn from "../components/LogoutBtn";

const LoginPage = () => {
  const [socialUser, setSocialUser] = useState(null);

  // JWT 메시지 수신
  useEffect(() => {
    const handleMessage = (event) => {
      const token = event.data;
      if (typeof token === "string" && token.split(".").length === 3) {
        localStorage.setItem("jwt", token);
        const payload = JSON.parse(atob(token.split(".")[1]));
        setSocialUser(payload);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // 새로고침 시 JWT 복원
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setSocialUser(payload);
      } catch {
        localStorage.removeItem("jwt");
      }
    }
  }, []);

  const onClickSocialLogin = async () => {
    const res = await fetch("http://localhost:4000/oauth/github");
    const { url } = await res.json();
    window.open(url, "_blank", "width=400,height=300");
  };

  const onClickLogout = () => {
    localStorage.removeItem("jwt");
    setSocialUser(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={logo} alt="GitPulse 로고" />
      </div>

      <div className={styles.right}>
        <p>반갑습니다.</p>
        <p>
          <span className={styles.emphasis}>신뢰의 시작, 협업의 가교</span>,{" "}
          <br />
          <strong>GitPulse</strong> 입니다.
        </p>

        {!socialUser ? (
          <button className={styles.loginButton} onClick={onClickSocialLogin}>
            <img src={git} alt="GitHub 아이콘" />
            Github로 로그인
          </button>
        ) : (
          <LogoutBtn user={socialUser} onLogout={onClickLogout} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
