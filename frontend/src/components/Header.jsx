import React from "react";
import css from "./Header.module.css";
import defaultProfile from "../assets/image 6.svg";

const Header = ({ name, profile }) => {
  return (
    <header className={css.headerContainer}>
      <div className={css.header}>
        <div className={css.headerLeft}>
          {profile && (
            <img
              src={profile || defaultProfile}
              alt="profile"
              className={css.profileImage}
            />
          )}
          <div className={css.textGroup}>
            <h2>
              <span className={css.headerHighlight}>Hi</span> {name},
            </h2>
            <p>It's looking like a good day</p>
          </div>
        </div>
        <div className={css.search}>
          <input
            type="text"
            placeholder="궁금한 사람의 깃허브 아이디를 입력하세요"
          />
          <i className="bi bi-search"></i>
        </div>
      </div>
    </header>
  );
};

export default Header;
