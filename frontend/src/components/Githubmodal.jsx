import React, { useEffect, useState } from "react";
import css from "../pages/ProfilePage.module.css"; // ProfilePage 스타일 재사용
import { X } from "lucide-react";
import { getGitHubUserInfo, getUserRepos } from "../apis/github";
import UserStatCard from "../components/UserStatCard";
import Header from "./ModalHeader";
import RepoTable from "../components/RepoTable";
import CommitTimeChart from "../components/CommitTimeChart";
import OneLineComment from "../components/OneLineComment";
import RewardBadges from "../hooks/RewardBadges";

const GithubModal = ({ username, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  // const [rate, setRate] = useState({ limit: 0, remaining: 0 });
  const [error, setError] = useState(null); // ✅ 에러 상태

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username)
        .then(setUserData)
        .catch((err) => {
          console.error("GitHub 유저 정보 요청 실패:", err);
          setError("GitHub 유저 정보가 없습니다."); // ✅ 에러 메시지 설정
        });

      getUserRepos(username)
        .then(setRepos)
        .catch(() => {}); // 레포 에러는 무시
    }
  }, [username]);

  // ✅ 에러 발생 시 메시지 출력
  if (error) {
    return (
      <div className={css.modalOverlay}>
        <div className={css.modal}>
          <p className={css.errorMessage}>{error}</p>
          <button className={css.modalCloseButton} onClick={onClose}>
            <X />
          </button>
        </div>
      </div>
    );
  }

  // ✅ 로딩 중
  if (!userData) {
    return (
      <div className={css.modalOverlay}>
        <div className={css.modal}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className={css.modalOverlay}>
      <div className={`${css.container} ${css.modalContainer}`}>
        <button className={css.modalCloseButton} onClick={onClose}>
          <X />
        </button>

        {/* <div className={css.rateLimit}>
          남은 요청: {rate.remaining} / {rate.limit}
        </div> */}

        <main className={css.main}>
          <Header
            name={userData.name || userData.login}
            profile={userData.avatar_url}
          />
          <div className={css.contentContainer}>
            <section className={css.profileStats}>
              <UserStatCard
                iconClass="bi bi-person-fill-check"
                label="Followers"
                value={userData.followers}
              />
              <UserStatCard
                iconClass="bi bi-person-heart"
                label="Followings"
                value={userData.following}
              />
              <UserStatCard
                iconClass="bi bi-cloud-check"
                label="Public Repos"
                value={userData.public_repos}
              />
            </section>

            <section className={css.badgeSection}>
              <div className={css.badgeCol}>
                <RewardBadges username={username} />
              </div>
              <div className={css.commentCol}>
                <OneLineComment comment="여기에 한 줄 코멘트가 들어갑니다." />
              </div>
            </section>

            <section className={css.contributions}>
              <h4>History</h4>
              <img
                src={`https://ghchart.rshah.org/${username}`}
                alt="GitHub Contributions"
                style={{ width: "100%", height: "auto" }}
              />
            </section>

            <section className={css.bottom}>
              <RepoTable username={username} />
              <div className={css.commitTimeChart}>
                <h4>Commit Time Graph</h4>
                <CommitTimeChart username={username} />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default GithubModal;
