import React from "react";
import ConventionErrTable from "./ConventionErrTable.jsx";
import css from "./ConventionError.module.css";

const ConventionError = ({ commits }) => {
  const commitMsgList = commits?.map((commit) => ({
    date: commit.commit.author.date,
    author: commit.commit.author.name,
    message: commit.commit.message,
  }));

  return (
    <div className={css.conventionErrorCon}>
      <h3>
        커밋 메세지 <strong>컨벤션 오류</strong>
      </h3>
      <ConventionErrTable commitMsgList={commitMsgList} />
    </div>
  );
};

export default ConventionError;
