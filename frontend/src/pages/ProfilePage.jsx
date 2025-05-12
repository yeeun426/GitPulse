import React, { useEffect, useState } from "react";
import css from "./ProfilePage.module.css";
import badge1 from "../assets/2025년 5월 9일 오전 09_46_53 1.svg";
import badge2 from "../assets/image 6.svg";
import badge3 from "../assets/image 7.svg";
import profile from "../assets/image 6.svg";
import UserStatCard from "../components/UserStatCard";
import { getGitHubUserInfo } from "../apis/github";

const ProfilePage = () => {
  const [githubId, setGithubId] = useState("yonggyu99");
  const [userData, setUserData] = useState({
    followers: 0,
    following: 0,
    public_repos: 0,
  });

  const fetchUserData = async (id) => {
    try {
      const data = await getGitHubUserInfo(id);
      setUserData(data);
    } catch (err) {
      alert("유효하지 않은 GitHub ID입니다.");
    }
  };

  useEffect(() => {
    fetchUserData(githubId);
  }, [githubId]);

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
        <header className={css.headerContainer}>
          <div className={css.header}>
            <div className={css.headerLeft}>
              <img
                src={userData.avatar_url || profile}
                alt="profile"
                className={css.profileImage}
              />

              <div className={css.textGroup}>
                <h2>
                  <span className={css.headerHighlight}>Hi</span>
                  {userData.name || userData.login},
                </h2>
                <p>It's looking like a slow day</p>
              </div>
            </div>

            <div className={css.search}>
              <input
                type="text"
                placeholder="궁금한 사람의 깃허브 아이디를 입력하세요"
              />
              <i className="bi bi-search"></i>
            </div>
          </div>
        </header>

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
              src={`https://ghchart.rshah.org/${githubId}`}
              alt="GitHub Contributions"
              style={{ width: "100%", height: "auto" }}
            />
          </section>

          {/* repo & 그래프 영역 */}
          <section className={css.bottom}>
            {/* repo table */}
            <div className={css.repoTable}>
              <h4>repo</h4>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Review</th>
                    <th>Recently Commit</th>
                    <th>Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>repo-name</td>
                    <td>32</td>
                    <td>2025.05.06</td>
                    <td>2025.03.06</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
