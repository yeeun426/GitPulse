import React from "react";
import css from "./Challenged.module.css";
import RepoRankcopy from "./RepoRankcopy";
import CommitKing from "./CommitKing";
import NeverStopChallenge from "./NeverStopChallenge";
const Challenged = () => {
  return (
    <div className={css.container}>
      <h2>Challenge</h2>
      <div className={css.flexRow}>
        <CommitKing />

        <NeverStopChallenge />
        <RepoRankcopy />
      </div>
    </div>
  );
};

export default Challenged;
