import React, { useEffect, useState } from "react";
import { fetchRepos, fetchReadme } from "../apis/RepoRank";
import ReactMarkdown from "react-markdown";
import styles from "./CommitKing.module.css";

const CommitKing = () => {
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
          <div>
            <p className={styles.commitLabel}>Commit’s Challenge</p>
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
              </li>
            ))}
          </ul>
          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommitKing;
