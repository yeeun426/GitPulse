import React from "react";
import css from "./ProfilePage.module.css";

const ProfilePage = () => {
  return (
    <div className={css.container}>
      <section className={css.sidebar}>
        <div className={css.logo}>logo</div>
        <nav className={css.menu}>
          <ul>
            <li className={css.active}>My Git</li>
            <li>Organization1</li>
            <li>Organization2</li>
            <li>Organization3</li>
            <li>Organization4</li>
            <li>Organization5</li>
          </ul>
        </nav>
      </section>

      <main className={css.main}>
        {/* 헤더영역 */}
        <header className={css.headerContainer}>
          <div className={css.header}>
            <div>
              <h2>
                <span className={css.headerHighlight}>Hi</span> Profile,
              </h2>
              <p>It's looking like a slow day</p>
            </div>

            <div className={css.search}>
              <input
                type="text"
                placeholder="궁금한 사람의 깃허브 아이디를 입력하세요"
              />
              <button>?</button>
            </div>
          </div>
        </header>

        {/* 카드 영역 */}
        <div className={css.contentContainer}>
          <section className={css.profileStats}>
            <div className={css.card}>
              <p>Followers</p>
              <p>350</p>
            </div>

            <div className={css.card}>
              <p>Followings</p>
              <p>450</p>
            </div>

            <div className={css.card}>
              <p>Public Repos</p>
              <p>3500</p>
            </div>
          </section>

          {/* 뱃지 영역 */}
          <section className={css.badges}>
            <div className={css.badge}>금</div>
            <div className={css.badge}>은</div>
            <div className={css.badge}>동</div>
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
