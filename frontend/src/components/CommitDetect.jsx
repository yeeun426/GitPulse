import React from "react";
import { useSuspiciousCommits } from "../hooks/useSuspiciousCommits";
import css from "./CommitDetect.module.css";

const CommitDetect = ({ name, repo }) => {
  const { suspiciousCommits, loading } = useSuspiciousCommits({
    name,
    repo,
  });

  return (
    <div className={css.detectTable}>
      <h3>커밋허수잡기</h3>
      {loading && <div>로딩 중...</div>}

      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>작성자</th>
            <th>메시지</th>
            <th>파일 수</th>
            <th>변경</th>
            <th>파일 종류</th>
            <th>console</th>
            <th>score</th>
          </tr>
        </thead>
        <tbody>
          {suspiciousCommits
            .filter((commit) => commit.isSuspicious)
            .map((commit) => (
              <tr key={commit.sha}>
                <td>{new Date(commit.date).toLocaleDateString()}</td>
                <td>{commit.author}</td>
                <td>{commit.message}</td>
                <td>{commit.fileCount}</td>
                <td>
                  +{commit.additions} / -{commit.deletions}
                </td>
                <td>
                  {commit.files
                    .map((f) => f.filename.split(".").pop())
                    .join(", ")}
                </td>
                <td>{commit.containsConsole ? "✅" : "❌"}</td>
                <td>{commit.score}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CommitDetect;
