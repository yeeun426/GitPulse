// pages/NewsPage.jsx
import React from "react";
import RepoRank from "../components/RepoRank";
import css from "./newsPage.module.css";
import ITblog from "../components/ITblog";
import Challenge from "../components/Challenge";
const NewsPage = () => {
  return (
    <div className={css.container}>
      <div className={css.box}>
        <ITblog />
        <Challenge />
      </div>
    </div>
  );
};

export default NewsPage;
