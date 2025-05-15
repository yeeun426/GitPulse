import styles from "./CommitKing.module.css";
import { useState } from "react";
import challengeImage from "../assets/challenge-visual.png";

const CommitKing = () => {
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = () => {
    setIsJoined(true);
  };
  return (
    <div className={styles.container}>
      {/* 항상 렌더링되며, 참가 전에는 블러 */}
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Commit King</p>
          </div>

          <ul className={styles.repoList}></ul>
          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>

      {/* 참가 전에는 contentBox 위에 겹쳐 보이는 오버레이 */}
      {!isJoined && (
        <div className={styles.joinOverlay}>
          <div className={styles.joinBox}>
            <p className={styles.title}>Commit King</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitKing;
