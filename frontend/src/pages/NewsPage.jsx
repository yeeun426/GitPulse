// pages/NewsPage.jsx
import React from "react";
import css from "./newsPage.module.css";
import ITblog from "../components/ITblog";
import Challenge from "../components/Challenge";
const NewsPage = () => {
  return (
    <div className={css.container}>
      <div className={css.box}>
        <ITblog />
      </div>
    </div>
  );
};

export default NewsPage;
