import React from "react";
import css from "./RepoTable.module.css";

const RepoTable = ({repos}) => {
  return (
    <div className={css.repoTable}>
      <h4>Repo</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stars</th>
            <th>Recently Commit</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo)=>())}
        </tbody>
      </table>
    </div>
  );
};

export default RepoTable;
