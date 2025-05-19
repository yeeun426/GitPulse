import React, { useEffect, useState } from "react";
import {
  fetchWithToken,
  getMonthlyCommitCount,
  getMonthlyCommitDays,
} from "../apis/github";
import styles from "./RepoRank.module.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import loading from "../assets/loading.png";

// 지난달 커밋 수와 커밋 일수 콘솔 출력 함수
export const logMonthlyCommitStats = async (username) => {
  const commitCount = await getMonthlyCommitCount(username);
  const commitDays = await getMonthlyCommitDays(username);

  console.log(`${username} 님의 지난달 커밋 수: ${commitCount}`);
  console.log(`${username} 님의 지난달 커밋 일수: ${commitDays}`);
};

const RepoRankcopy = ({ selectedUser }) => {
  const [commitList, setCommitList] = useState([]);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [commitFiles, setCommitFiles] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    if (selectedUser) {
      logMonthlyCommitStats(selectedUser);
    }
  }, [selectedUser]);

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
        const now = new Date();
        const thisMonthFirst = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthFirst = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const sinceISOString = lastMonthFirst.toISOString();
        const untilISOString = thisMonthFirst.toISOString();

        const events = [];
        for (let page = 1; page <= 3; page++) {
          const res = await fetchWithToken(`/users/${selectedUser}/events`, {
            per_page: 100,
            page,
          });

          if (!Array.isArray(res) || res.length === 0) break;

          res.forEach((event) => {
            if (
              event.type === "PushEvent" &&
              event.created_at >= sinceISOString &&
              event.created_at < untilISOString
            ) {
              events.push(event);
            }
          });
        }

        // 이벤트 기반 커밋 리스트 생성
        const allCommits = [];

        for (const event of events) {
          const repoName = event.repo.name.split("/")[1];
          const eventDate = event.created_at;

          event.payload.commits.forEach((commit) => {
            allCommits.push({
              sha: commit.sha,
              repoName,
              commit: {
                message: commit.message,
                author: {
                  date: eventDate,
                  name: commit.author?.name || "",
                  email: commit.author?.email || "",
                },
              },
            });
          });
        }

        allCommits.sort(
          (a, b) =>
            new Date(b.commit.author.date) - new Date(a.commit.author.date)
        );

        setCommitList(allCommits);
      } catch (e) {
        console.error("커밋 가져오기 실패", e);
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
      <h2 className={styles.containertitle}>{selectedUser}'s Commits </h2>
      <div className={styles.contentBox}>
        {/* 좌측: 커밋 메시지 리스트 */}
        <div className={styles.readmeViewer}>
          <h3 className={styles.readmeHeader}>커밋 메시지</h3>

          <div style={{ marginTop: 16 }}>
            {loadingCommits && (
              <div className={styles.loadingCommits}>
                <img src={loading} alt="커밋 로딩" />
              </div>
            )}
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
        </div>

        {/* 우측: 커밋 코드(diff) */}
        <div className={styles.readmeViewer}>
          <h3 className={styles.readmeHeader}>커밋 코드</h3>
          <div className={styles.readmeScrollable}>
            {loadingFiles && (
              <div className={styles.loadingCommits}>
                <img src={loading} alt="커밋 로딩" />
              </div>
            )}
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
