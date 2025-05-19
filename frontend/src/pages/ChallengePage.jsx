import React, { useState } from "react";
import css from "./ChallengePage.module.css";
import CommitKingOnly from "../components/CommitKingOnly";
import CommitAndContinueChallenge from "../components/CommitAndContinueChallenge";

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
