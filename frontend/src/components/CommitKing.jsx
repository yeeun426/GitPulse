import styles from "./CommitKing.module.css";

const CommitKing = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        {/* 📦 레포리스트 + 정렬 + 페이지네이션 */}

        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Commit’s Challenge</p>
          </div>

          <ul className={styles.repoList}></ul>
          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitKing;
