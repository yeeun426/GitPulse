import React from "react";
import { useParams } from "react-router-dom";
import css from "./ProfilePage.module.css";
import Header from "../components/Header";
import { useOrgsInfo } from "../apis/useOrganizationApi";

const OrganizationPage = () => {
  const { name } = useParams();

  const { data, isLoading, isError } = useOrgsInfo(name);

  const members = data?.members;
  const repos = data?.repos;

  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역  + desc 추가 예정 */}
        <Header name={name} />

        {/* orgs info 영역 */}
        <div className={css.contentContainer}>
          <section className={css.profileStats}>
            <div className={css.card}>
              <i className="bi bi-cloud-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>현재 레포지토리</p>
                {repos?.length > 0 && (
                  <p className={css.cardValue}>{repos[0]?.name}</p>
                )}
              </div>
            </div>
            <div className={css.card}>
              <i className="bi bi-person-fill-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Members</p>
                <p className={css.cardValue}>{members?.length}</p>
              </div>
            </div>

            <div className={css.card}>
              <i className="bi bi-person-heart"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>Public Repos</p>
                <p className={css.cardValue}>{repos?.length}</p>
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
