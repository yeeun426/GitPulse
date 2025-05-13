import React, { useEffect, useState } from "react";
import { fetchRepos, fetchReadme } from "../apis/RepoRank";
import ReactMarkdown from "react-markdown";
import styles from "./RepoRank.module.css";

const RepoRank = () => {
  const [repos, setRepos] = useState([]);
  const [sortType, setSortType] = useState("stars");
  const [selectedReadme, setSelectedReadme] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadRepos = async (sort, pageNum) => {
    try {
      setLoading(true);
      const data = await fetchRepos(sort, pageNum);
      setRepos(data);
    } catch (err) {
      console.error("❌ 레포지토리 로딩 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepos(sortType, page);
  }, [sortType, page]);

  const handlePreview = async (repo) => {
    try {
      const md = await fetchReadme(repo.owner.login, repo.name);
      setSelectedReadme(md);
      setSelectedRepo(repo.full_name);
    } catch (err) {
      setSelectedReadme("❌ README.md를 불러올 수 없습니다.");
      setSelectedRepo(repo.full_name);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentBox}>
        {/* 📦 레포리스트 + 정렬 + 페이지네이션 */}

        <div className={styles.repoListBox}>
          <div className={styles.sortTabs}>
            {["stars", "created", "updated"].map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSortType(type);
                  setPage(1);
                }}
                className={`${styles.sortButton} ${
                  sortType === type ? styles.active : ""
                }`}
              >
                {type === "stars" && "인기순"}
                {type === "created" && "최근 생성"}
                {type === "updated" && "최근 수정"}
              </button>
            ))}
          </div>

          <ul className={styles.repoList}>
            {repos.map((repo, idx) => (
              <li key={repo.id} className={styles.repoItem}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.repoLink}
                >
                  {idx + 1 + (page - 1) * 10}. {repo.full_name}
                </a>
                <button
                  onClick={() => handlePreview(repo)}
                  className={styles.previewButton}
                >
                  미리보기
                </button>
              </li>
            ))}
          </ul>

          {/* ⏪ 숫자형 페이지네이션 */}
          <div className={styles.pagination}>
            <button onClick={() => setPage(1)} disabled={page === 1}>
              «
            </button>
            {[...Array(10)].map((_, i) => {
              const pageNum = i + 1;
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
            <button onClick={() => setPage(10)} disabled={page === 10}>
              »
            </button>
          </div>
        </div>

        {/* 📘 README 뷰어 */}
        <div className={styles.readmeViewer}>
          <h3 className={styles.readmeHeader}> README</h3>
          <div className={styles.readmeScrollable}>
            {selectedReadme ? (
              <ReactMarkdown>{selectedReadme}</ReactMarkdown>
            ) : (
              <div className={styles.emptyPlaceholder}>
                📄 README를 선택하세요
              </div>
            )}
          </div>
          {selectedRepo && (
            <a
              href={`https://github.com/${selectedRepo}`}
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

export default RepoRank;
