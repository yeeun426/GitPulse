// pages/NewsPage.jsx
import React from "react";
import RepoRank from "../components/RepoRank";
import css from "./newsPage.module.css";
const NewsPage = () => {
  return (
    <div className={css.container}>
      <h2>Open Repositories</h2>
      <RepoRank />
    </div>
  );
};

export default NewsPage;
