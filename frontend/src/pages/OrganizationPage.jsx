import React from "react";
import { useParams } from "react-router-dom";
import css from "./ProfilePage.module.css";

const OrganizationPage = () => {
  const { id, name } = useParams();

  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역 */}
        <header className={css.headerContainer}>
          <div className={css.header}>
            <div className={css.headerLeft}>
              <div className={css.textGroup}>
                <h2>
                  <span className={css.headerHighlight}>Hi</span> {name},
                </h2>
                <p>It's looking like a good day</p>
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

        <div className={css.contentContainer}>
          <section className={css.profileStats}>
            <div className={css.card}>
              <i className="bi bi-person-fill-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Total Commit</p>
                <p className={css.cardValue}>350</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-person-heart"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>People</p>
                <p className={css.cardValue}>4</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-cloud-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Public Repos</p>
                <p className={css.cardValue}>3</p>
              </div>
            </div>
          </section>

          {/* 커밋 graph 영역 */}
          <section className={css.contributions}>
            <h4>Week</h4>
            <div className={css.contributionGraph}>커밋 그래프 자리</div>
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
          </section>
        </div>
      </main>
    </div>
  );
};

export default OrganizationPage;
