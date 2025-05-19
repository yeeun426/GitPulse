import React, { useEffect, useState } from "react";
import styles from "./CommitListViewer.module.css";
import { getRepoCommits, fetchReadme } from "../apis/github";
import ReactMarkdown from "react-markdown";

const CommitListViewer = ({ selectedUser, selectedRepo, activeType }) => {
  const [commits, setCommits] = useState([]);
  const [readme, setReadme] = useState("");

  useEffect(() => {
    const load = async () => {
      if (activeType === "star" && selectedRepo) {
        const data = await fetchReadme(
          selectedRepo.owner.login,
          selectedRepo.name
        );
        setReadme(data);
      } else if (
        (activeType === "commit" || activeType === "continue") &&
        selectedUser
      ) {
        const list = await getRepoCommits(selectedUser, "", 10);
        setCommits(list);
      }
    };
    load();
  }, [selectedUser, selectedRepo, activeType]);

  return (
    <div className={styles.viewerContainer}>
      <div className={styles.commitListBox}>
        <div className={styles.commitListHeader}>Commits</div>
        <ul className={styles.commitList}>
          {commits.length ? (
            commits.map((c, i) => (
              <li key={i}>{c.commit.message || "No message"}</li>
            ))
          ) : (
            <li>No commits</li>
          )}
        </ul>
      </div>
      <div className={styles.readmeWrapper}>
        <div className={styles.readmeHeader}>CONTENT</div>
        {readme ? (
          <ReactMarkdown>{readme}</ReactMarkdown>
        ) : (
          <div className={styles.empty}>No README</div>
        )}
        {selectedRepo && (
          <a
            className={styles.repoBtn}
            href={`https://github.com/${selectedRepo.full_name}`}
            target="_blank"
            rel="noreferrer"
          >
            Repository 가기 &gt;&gt;
          </a>
        )}
      </div>
    </div>
  );
};

export default CommitListViewer;
