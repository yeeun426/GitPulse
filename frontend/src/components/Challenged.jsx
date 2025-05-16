import React from "react";
import css from "./Challenged.module.css";
import RepoRankcopy from "./RepoRankcopy";
import CommitKing from "./CommitKing";
import NeverStopChallenge from "./NeverStopChallenge";
import Challenge from "./Challenge";
import CommitAndContinueChallenge from "./CommitAndContinueChallenge";
import CommitKingOnly from "./CommitKingOnly";
import RepoRank from "./RepoRank";
const Challenged = () => {
  return (
    <div className={css.container}>
      <h2>Challenge</h2>
      <div className={css.flexRow}>
        <CommitKingOnly />
        <CommitAndContinueChallenge type="continue" />
        <RepoRankcopy />
      </div>

      <div className={css.bottomRow}>
        <RepoRank />
      </div>
    </div>
  );
};

export default Challenged;
