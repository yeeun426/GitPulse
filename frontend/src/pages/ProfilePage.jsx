import React from "react";
import css from "./ProfilePage.module.css";
import badge1 from "../assets/2025년 5월 9일 오전 09_46_53 1.svg";
import badge2 from "../assets/image 6.svg";
import badge3 from "../assets/image 7.svg";
import profile from "../assets/image 6.svg";

const ProfilePage = () => {
  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역 */}
        <header className={css.headerContainer}>
          <div className={css.header}>
            <div className={css.headerLeft}>
              <img src={profile} alt="profile" className={css.profileImage} />

              <div className={css.textGroup}>
                <h2>
                  <span className={css.headerHighlight}>Hi</span> Profile,
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
            <div className={css.card}>
              <i className="bi bi-person-fill-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Followers</p>
                <p className={css.cardValue}>350</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-person-heart"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Followings</p>
                <p className={css.cardValue}>450</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-cloud-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Public Repos</p>
                <p className={css.cardValue}>3500</p>
              </div>
            </div>
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
            <div className={css.contributionGraph}>커밋 잔디 그래프 자리</div>
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
