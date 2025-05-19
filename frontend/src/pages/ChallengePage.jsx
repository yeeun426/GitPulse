import React, { useState } from "react";
import styles from "./ChallengePage.module.css";
import ChallengeBox from "../components/ChallengeBox";
import CommitListViewer from "../components/CommitListViewer";

const ChallengePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [activeType, setActiveType] = useState(null);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Challenge</h2>
      <div className={styles.challengeRow}>
        <ChallengeBox
          title="Commit's Challenge"
          type="commit"
          onSelect={(user) => {
            setSelectedUser(user);
            setSelectedRepo(null);
            setActiveType("commit");
          }}
        />
        <ChallengeBox
          title="Never Stop Challenge"
          type="continue"
          onSelect={(user) => {
            setSelectedUser(user);
            setSelectedRepo(null);
            setActiveType("continue");
          }}
        />
        <ChallengeBox
          title="Open Repo Ranking"
          type="star"
          onSelect={(repo) => {
            setSelectedRepo(repo);
            setSelectedUser(null);
            setActiveType("star");
          }}
        />
      </div>
      <div className={styles.viewerSection}>
      <h2 className={styles.title}>Commit List</h2>
        <CommitListViewer
          selectedUser={selectedUser}
          selectedRepo={selectedRepo}
          activeType={activeType}
        />
      </div>
    </div>
  );
};
export default ChallengePage;
