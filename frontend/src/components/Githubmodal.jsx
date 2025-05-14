import React, { useEffect, useState } from "react";
import css from "../pages/ProfilePage.module.css"; // ProfilePage 스타일 재사용
import { X } from "lucide-react";
import { getGitHubUserInfo, getRateLimit, getUserRepos } from "../apis/github";
import UserStatCard from "../components/UserStatCard";
import Header from "./ModalHeader";
import RepoTable from "../components/RepoTable";
import CommitTimeChart from "../components/CommitTimeChart";
import OneLineComment from "../components/OneLineComment";
import RewardBadges from "../utils/RewardBadges";

const GithubModal = ({ username, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [rate, setRate] = useState({ limit: 0, remaining: 0 });

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username).then(setUserData);
      getUserRepos(username).then(setRepos);
      getRateLimit()
        .then((data) => {
          const core = data.resources.core;
          setRate({ limit: core.limit, remaining: core.remaining });
        })
        .catch((err) => console.error("Rate limit fetch failed", err));
    }
  }, [username]);

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
        {/* 닫기 버튼 */}
        <button className={css.modalCloseButton} onClick={onClose}>
          <X />
        </button>

        {/* 요청 제한 */}
        <div className={css.rateLimit}>
          남은 요청: {rate.remaining} / {rate.limit}
        </div>

        <main className={css.main}>
          {/* 헤더 */}
          <Header
            name={userData.name || userData.login}
            profile={userData.avatar_url}
          />

          <div className={css.contentContainer}>
            {/* 유저 통계 카드 */}
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

            {/* 뱃지 & 코멘트 */}
            <section className={css.badgeSection}>
              <div className={css.badgeCol}>
                <RewardBadges username={username} />
              </div>
              <div className={css.commentCol}>
                <OneLineComment comment="여기에 한 줄 코멘트가 들어갑니다." />
              </div>
            </section>

            {/* 커밋 히스토리 */}
            <section className={css.contributions}>
              <h4>History</h4>
              <img
                src={`https://ghchart.rshah.org/${username}`}
                alt="GitHub Contributions"
                style={{ width: "100%", height: "auto" }}
              />
            </section>

            {/* 레포 & 그래프 */}
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
