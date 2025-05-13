import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import css from "./ProfilePage.module.css";
import orgs from "./OrganizationPage.module.css";
import Header from "../components/Header";
import { useOrgsInfo, useOrgsRepos } from "../apis/useOrganizationApi";

const OrganizationPage = () => {
  const { name } = useParams();
  const { data, isLoading, isError } = useOrgsInfo(name);
  const members = data?.members;
  const repos = data?.repos;

  const [selected, setSelected] = useState("");
  const [commitCounts, setCommitCounts] = useState({});

  const {
    data: commits,
    isRepoLoading,
    isRepoError,
  } = useOrgsRepos(name, selected);

  useEffect(() => {
    if (repos && repos.length > 0) {
      setSelected(repos[0].name);
    }
  }, [repos]);

  useEffect(() => {
    if (!commits) return;

    // 현재 UTC 기준 일요일 날짜 계산
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setUTCDate(today.getUTCDate() - today.getUTCDay()); // 일요일
    startOfWeek.setUTCHours(0, 0, 0, 0);

    // 일요일 ~ 토요일 배열
    const dateArray = [...Array(7)].map((_, i) => {
      const d = new Date(startOfWeek);
      d.setUTCDate(startOfWeek.getUTCDate() + i);
      return d.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    });

    // 초기값 0
    const commitCountByDay = dateArray.reduce((acc, dateStr) => {
      acc[dateStr] = 0;
      return acc;
    }, {});

    // 커밋 수 계산
    commits.forEach((commit) => {
      const commitDate = new Date(commit.commit.author.date);
      const dateStr = commitDate.toISOString().split("T")[0];
      if (Object.prototype.hasOwnProperty.call(commitCountByDay, dateStr)) {
        commitCountByDay[dateStr] += 1;
      }
    });

    setCommitCounts(commitCountByDay);
  }, [commits]);

  useEffect(() => {
    console.log(commitCounts);
  }, [commitCounts]);

  if (isLoading || isRepoLoading) return <p>Loading...</p>;
  if (isError || isRepoError) return <p>에러 발생!</p>;

  return (
    <div className={css.container}>
      <main className={css.main}>
        {/* 헤더영역  + desc 추가 예정 */}
        <Header name={name} />

        <div className={css.contentContainer}>
          {/* orgs info 영역 */}
          <section className={css.profileStats}>
            <div className={css.card}>
              <i className="bi bi-cloud-check"></i>
              <div className={css.cardText}>
                <p className={css.cardLabel}>현재 레포지토리</p>
                <select onChange={(e) => setSelected(e.target.value)}>
                  {repos?.map((item, index) =>
                    item?.name ? (
                      <option
                        className={orgs.cardValue}
                        key={index}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    ) : null
                  )}
                </select>
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
