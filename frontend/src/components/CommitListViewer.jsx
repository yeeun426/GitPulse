import React, { useEffect, useState } from "react";
import css from "./CommitListViewer.module.css";
import {
  getRepoCommits,
  fetchReadme,
  getUserRepos,
  getCommitDiff,
} from "../apis/github";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CommitListViewer = ({ selectedUser, selectedRepo, activeType }) => {
  const [commits, setCommits] = useState([]);
  const [readme, setReadme] = useState("");
  const [commitDiff, setCommitDiff] = useState("");
  const [repoName, setRepoName] = useState("");

  useEffect(() => {
    const load = async () => {
      setCommits([]);
      setReadme("");
      setCommitDiff("");
      setRepoName("");

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
        const repos = await getUserRepos(selectedUser, 1, 1);
        if (!repos.length) return;
        const firstRepo = repos[0].name;
        setRepoName(firstRepo);
        const list = await getRepoCommits(selectedUser, firstRepo, 10);
        setCommits(list);
      }
    };
    load();
  }, [selectedUser, selectedRepo, activeType]);

  const handleClickCommit = async (sha) => {
    if (!selectedUser || !repoName) return;
    const diff = await getCommitDiff(selectedUser, repoName, sha);
    setCommitDiff(diff);
  };

  return (
    <div className={css.viewerContainer}>
      <div className={css.commitListBox}>
        <div className={css.commitListHeader}>Commits</div>
        <ul className={css.commitList}>
          {commits.length ? (
            commits.map((c, i) => (
              <li key={i} onClick={() => handleClickCommit(c.sha)}>
                {c.commit.message || "No message"}
              </li>
            ))
          ) : (
            <li>No commits</li>
          )}
        </ul>
      </div>

      <div className={css.readmeWrapper}>
        <div className={css.readmeHeader}>CONTENT</div>
        <div className={css.readmeContent}>
          {activeType === "star" ? (
            readme ? (
              <ReactMarkdown>{readme}</ReactMarkdown>
            ) : (
              <div className={css.empty}>No README</div>
            )
          ) : commitDiff ? (
            <SyntaxHighlighter language="diff" style={dracula}>
              {commitDiff}
            </SyntaxHighlighter>
          ) : (
            <div className={css.empty}>No commit code</div>
          )}
        </div>
        {selectedRepo && activeType === "star" && (
          <a
            className={css.repoBtn}
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
