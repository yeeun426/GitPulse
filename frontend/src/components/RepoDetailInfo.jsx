import React from "react";
import css from "./RepoDetailInfo.module.css";

const RepoDetailInfo = () => {
  return (
    <div className={css.repoInfoCon}>
      <div className={css.repoInfoItems}>
        <div>
          <p>Issue</p>
          <p>3781</p>
        </div>
        <div>
          <p>Language</p>
          <p>React</p>
        </div>
      </div>
      <div className={css.repoReviewItems}>
        <p>Review</p>
        <p>31230</p>
      </div>
    </div>
  );
};

export default RepoDetailInfo;
