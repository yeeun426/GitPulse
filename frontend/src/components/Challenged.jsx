import React, { useState } from "react";
import css from "./Challenged.module.css";
import RepoRankcopy from "./RepoRankcopy";
import CommitKingOnly from "./CommitKingOnly";
import CommitAndContinueChallenge from "./CommitAndContinueChallenge";
import RepoRank from "./RepoRank";
const Challenged = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className={css.container}>
      <h2>Challenge</h2>
      <div className={css.flexRow}>
        <CommitKingOnly
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        {/* <CommitAndContinueChallenge type="continue" /> */}
        <RepoRankcopy />
      </div>
      <RepoRank />
    </div>
  );
};

export default Challenged;
