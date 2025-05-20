import React, { useState } from "react";
import css from "./Challenged.module.css";
import RepoRankcopy from "./RepoRankcopy";
import CommitKingOnly from "./CommitKingOnly";
import CommitAndContinueChallenge from "./CommitAndContinueChallenge";

const Challenged = () => {
  return (
    <div className={css.container}>
      <h2>Challenge</h2>

      <CommitKingOnly />
      <CommitAndContinueChallenge type="continue" />
      {/* <RepoRankcopy /> */}
      {/* <RepoRankcopy selectedUser={selectedUser} /> */}
    </div>
  );
};

export default Challenged;
