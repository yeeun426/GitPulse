import React, { useState, useEffect } from "react";
import logo from "../assets/Logo.png";
import git from "../assets/Git.png";
import styles from "./LoginPage.module.css";
import LogoutBtn from "../components/LogoutBtn";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [socialUser, setSocialUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = (event) => {
      const token = event.data;

      if (typeof token === "string" && token.split(".").length === 3) {
        localStorage.setItem("jwt", token);

        try {
          const base64Url = token.split(".")[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const padded = base64.padEnd(
            base64.length + ((4 - (base64.length % 4)) % 4),
            "="
          );
          const payload = JSON.parse(atob(padded));

          localStorage.setItem("username", payload.login);
          setSocialUser(payload);
          navigate("/profile");
        } catch (err) {
          console.error("🚨 JWT 디코딩 실패:", err);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onClickSocialLogin = async () => {
    const res = await fetch("https://gitpulse-04.onrender.com/oauth/github");
    const { url } = await res.json();
    window.open(url, "_blank", "width=400,height=300");
  };

  const onClickLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username");
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
          <span className={styles.emphasis}>신뢰의 시작, 협업의 가교</span>,
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
