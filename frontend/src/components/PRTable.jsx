import React from "react";
import css from "./PRTable.module.css";
import { useOrgsPR } from "../apis/useOrganizationApi";

const RepoTable = ({ orgs, repo }) => {
  const { data: PRList, isLoading, isError } = useOrgsPR(orgs, repo);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;
  console.log(PRList);
  return (
    <div className={css.repoTable}>
      <h4>PR List</h4>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Stars</th>
            <th>Created At</th>
            <th>Review</th>
          </tr>
        </thead>
        <tbody>
          {PRList?.map((PR, index) => (
            <tr key={index}>
              <td>
                <a className={css.repoLink}>{PR.title}</a>
              </td>
              <td>{PR.user.login}</td>
              <td>{PR.created_at}</td>
              <td>
                <button>Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepoTable;
