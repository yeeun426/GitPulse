import React, { useEffect, useState } from "react";
import css from "./ProfilePage.module.css";
import badge1 from "../assets/2025년 5월 9일 오전 09_46_53 1.svg";
import badge2 from "../assets/image 6.svg";
import badge3 from "../assets/image 7.svg";
import UserStatCard from "../components/UserStatCard";
import { getGitHubUserInfo, getUserRepos } from "../apis/github";
import RepoTable from "../components/RepoTable";
import Header from "../components/Header";

const ProfilePage = () => {
  const username = localStorage.getItem("username");
  const [userData, setUserData] = useState({
    followers: 0,
    following: 0,
    public_repos: 0,
    name: "",
    login: "",
    avatar_url: "",
  });
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username).then((data) => setUserData(data));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username).then((data) => setUserData(data));
      getUserRepos(username).then((repoData) => setRepos(repoData));
    }
  }, [username]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value.trim();
      if (value) setGithubId(value);
    }
  };

  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역 */}
        <Header
          name={userData.name || userData.login}
          profile={userData.avatar_url}
        />

        {/* 카드 영역 */}
        <div className={css.contentContainer}>
          <section className={css.profileStats}>
            <UserStatCard
              iconClass="bi bi-person-fill-check"
              label="Followers"
              value={userData.followers}
              // value="450"
            />

            <UserStatCard
              iconClass="bi bi-person-heart"
              label="Followings"
              value={userData.following}
              // value="450"
            />

            <UserStatCard
              iconClass="bi bi-cloud-check"
              label="Publoc Repos"
              value={userData.public_repos}
              // value="450"
            />
          </section>

          {/* 뱃지 영역 */}
          <section className={css.badgeContainer}>
            <img src={badge1} alt="badee1" className={css.badge} />
            <img src={badge2} alt="badee1" className={css.badge} />
            <img src={badge3} alt="badee1" className={css.badge} />
          </section>

          {/* 커밋 잔디 영역 */}
          <section className={css.contributions}>
            <h4>History</h4>
            <img
              src={`https://ghchart.rshah.org/${username}`}
              alt="GitHub Contributions"
              style={{ width: "100%", height: "auto" }}
            />
          </section>

          {/* repo & 그래프 영역 */}
          <section className={css.bottom}>
            {/* repo table */}
            <RepoTable username={username} />

            {/* graph */}
            <div className={css.commitTimeChart}>
              <h4>낮/밤</h4>
              <div className={css.chartBox}>원형차트자리</div>
              <div className={css.commitcount}>
                <p>Morning : 38%</p>
                <p>Daytime : 38%</p>
                <p>Evening : 38%</p>
                <p>Night : 38%</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
