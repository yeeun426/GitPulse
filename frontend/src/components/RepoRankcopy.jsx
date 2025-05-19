import React, { useEffect, useState } from "react";
import { getUserRepos, getRepoCommits, fetchWithToken } from "../apis/github";
import styles from "./RepoRank.module.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

const RepoRankcopy = ({ selectedUser }) => {
  const [commitList, setCommitList] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitFiles, setCommitFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (!selectedUser) {
      setCommitList([]);
      setSelectedCommit(null);
      setCommitFiles([]);
      return;
    }

    const fetchCommits = async () => {
      setLoadingCommits(true);
      setCommitList([]);
      setSelectedCommit(null);
      setCommitFiles([]);
      try {
        const repos = await getUserRepos(selectedUser, 1, 100);
        let allCommits = [];
        for (const repo of repos) {
          const commits = await getRepoCommits(selectedUser, repo.name, 10);
          allCommits = allCommits.concat(
            commits.map((c) => ({ ...c, repoName: repo.name }))
          );
        }
        allCommits.sort(
          (a, b) =>
            new Date(b.commit.author.date) - new Date(a.commit.author.date)
        );
        setCommitList(allCommits);
      } catch (e) {
        setCommitList([]);
      }
      setLoadingCommits(false);
    };

    fetchCommits();
  }, [selectedUser]);

  const commitsPerPage = 10;
  const totalPages = Math.ceil(commitList.length / commitsPerPage);
  const pagedCommits = commitList.slice(
    (page - 1) * commitsPerPage,
    page * commitsPerPage
  );

  const maxVisibleButtons = 10;
  const startPage =
    Math.floor((page - 1) / maxVisibleButtons) * maxVisibleButtons + 1;
  const endPage = Math.min(startPage + maxVisibleButtons - 1, totalPages);

  const handleCommitClick = async (commit) => {
    setSelectedCommit(commit);
    setCommitFiles([]);
    setLoadingFiles(true);
    try {
      const data = await fetchWithToken(
        `/repos/${selectedUser}/${commit.repoName}/commits/${commit.sha}`
      );
      setCommitFiles(data.files || []);
    } catch (e) {
      setCommitFiles([]);
    }
    setLoadingFiles(false);
  };

  useEffect(() => {
    setSelectedCommit(null);
    setCommitFiles([]);
  }, [page]);

  if (!selectedUser) return null;

  return (
    <div className={styles.container}>
      <h2 className={styles.containertitle}>{selectedUser}'s' Commits</h2>
      <div className={styles.contentBox}>
        {/* 좌측: 커밋 메시지 리스트 + 페이지네이션 */}
        <div className={styles.readmeViewer}>
          <h3 className={styles.readmeHeader}>커밋 메시지</h3>

          <div className={styles.pagination}>
            <button onClick={() => setPage(1)} disabled={page === 1}>
              «
            </button>

            {startPage > 1 && (
              <button onClick={() => setPage(startPage - 1)}>...</button>
            )}

            {[...Array(endPage - startPage + 1)].map((_, i) => {
              const pageNum = startPage + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={page === pageNum ? styles.activePage : ""}
                >
                  {pageNum}
                </button>
              );
            })}

            {endPage < totalPages && (
              <button onClick={() => setPage(endPage + 1)}>...</button>
            )}

            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              »
            </button>
          </div>

          <div style={{ marginTop: 16 }}>
            {loadingCommits && <div>커밋 로딩 중...</div>}
            {!loadingCommits && pagedCommits.length === 0 && (
              <div className={styles.emptyPlaceholder}>커밋이 없습니다</div>
            )}
            {!loadingCommits &&
              pagedCommits.map((commit) => (
                <button
                  key={commit.sha}
                  onClick={() => handleCommitClick(commit)}
                  className={
                    selectedCommit?.sha === commit.sha ? styles.activePage : ""
                  }
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    marginBottom: "4px",
                    background:
                      selectedCommit?.sha === commit.sha ? "#d0f0ff" : "#fff",
                    border: "1px solid #eee",
                    borderRadius: 4,
                    padding: 8,
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    {commit.commit.message}
                  </div>
                  <div style={{ fontSize: "12px", color: "#888" }}>
                    {commit.repoName} | {commit.commit.author.date.slice(0, 10)}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* 우측: 커밋 코드(diff) */}
        <div className={styles.readmeViewer}>
          <h3 className={styles.readmeHeader}>커밋 코드</h3>
          <div className={styles.readmeScrollable}>
            {loadingFiles && <div>코드 로딩 중...</div>}
            {!loadingFiles && commitFiles.length > 0 ? (
              commitFiles.map((file) => (
                <div key={file.filename} style={{ marginBottom: "24px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                    {file.filename}
                  </div>
                  <SyntaxHighlighter language={file.filename.split(".").pop()}>
                    {file.patch || "// diff 없음 또는 바이너리 파일"}
                  </SyntaxHighlighter>
                </div>
              ))
            ) : !loadingFiles ? (
              <div className={styles.emptyPlaceholder}>
                📄 commit를 선택하세요
              </div>
            ) : null}
          </div>
          {selectedCommit && (
            <a
              href={`https://github.com/${selectedUser}/${selectedCommit.repoName}/commit/${selectedCommit.sha}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoButton}
            >
              레포지토리 가기
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepoRankcopy;
