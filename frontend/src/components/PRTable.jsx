import React from "react";
import css from "./PRTable.module.css";

const RepoTable = () => {
  return (
    <div className={css.repoTable}>
      <h4>PR List</h4>
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
          <tr>
            <td>
              <a className={css.repoLink}>test</a>
            </td>
            <td>3</td>
            <td>2025-05-14</td>
            <td>2025-05-13</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RepoTable;
