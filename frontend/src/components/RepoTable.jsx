import React from "react";
import css from "./RepoTable.module.css";

const RepoTable = () => {
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
          {<tr>
            <td>repo-name</td>
            <td>32</td>
            <td>2025.05.06</td>
            <td>2025.03.06</td>
          </tr>}
        </tbody>
      </table>
    </div>
  );
};

export default RepoTable;
