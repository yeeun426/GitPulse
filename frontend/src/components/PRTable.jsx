import React from "react";
import css from "./PRTable.module.css";
import { useOrgsPR } from "../apis/useOrganizationApi";

const RepoTable = ({ orgs, repo }) => {
  const { data: PRList, isLoading, isError } = useOrgsPR(orgs, repo);
  console.log(PRList);
  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  return (
    <div className={css.prTable}>
      <h5>PR List</h5>
      <div className={css.tableWrapper}>
        <table className={css.tableHeader}>
          <thead>
            <tr>
              <th className={css.colTitle}>Title</th>
              <th className={css.colStars}>User</th>
              <th className={css.colCreated}>Created At</th>
              <th className={css.colReview}>Review</th>
            </tr>
          </thead>
        </table>
        <div className={css.scrollBody}>
          <table className={css.tableBody}>
            <tbody>
              {Array.isArray(PRList)
                ? PRList.map((PR, index) => (
                    <tr key={index}>
                      <td className={css.colTitle}>
                        <a className={css.prLink}>{PR.title}</a>
                      </td>
                      <td className={css.colStars}>{PR.user.login}</td>
                      <td className={css.colCreated}>
                        {PR.created_at.split("T")[0]}
                      </td>
                      <td className={css.colReview}>
                        <button>Review</button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepoTable;
