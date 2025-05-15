import React from "react";
import { useSuspiciousCommits } from "../hooks/useSuspiciousCommits";
import css from "./CommitDetect.module.css";

const CommitDetect = ({ name, repo }) => {
  const { suspiciousCommits, loading } = useSuspiciousCommits({
    name,
    repo,
  });

  console.log(suspiciousCommits);
  return (
    <div className={css.detectTable}>
      <div className={css.tableTitle}>
        <h3>
          커밋 <strong>허수</strong> 잡기
        </h3>
        <p>의미 없는 커밋을 분석해, 실제 기여도를 정직하게 평가합니다.</p>
      </div>
      {loading ? (
        <div className={css.loader}>
          <img src="/img/police_loader.gif" />
          <div>허수 잡으러 가는 중... 잠시만 기다려주세요 !</div>
        </div>
      ) : (
        <div className={css.tableWrapper}>
          <table className={css.tableHeader}>
            <thead>
              <tr>
                <th className={css.colDate}>날짜</th>
                <th className={css.colUser}>작성자</th>
                <th className={css.colTitle}>메시지</th>
                <th className={css.colCnt}>파일 수</th>
                <th className={css.colChange}>변경</th>
                <th className={css.colFile}>파일 종류</th>
                <th className={css.colConsole}>console</th>
                <th className={css.colScore}>score</th>
              </tr>
            </thead>
          </table>
          <div className={css.scrollBody}>
            <table className={css.tableBody}>
              <tbody>
                {suspiciousCommits
                  .filter((commit) => commit.isSuspicious)
                  .map((commit) => (
                    <tr key={commit.sha}>
                      <td className={css.colDate}>
                        {new Date(commit.date).toLocaleDateString()}
                      </td>
                      <td className={css.colUser}>{commit.author}</td>
                      <td className={css.colTitle}>{commit.message}</td>
                      <td className={css.colCnt}>{commit.fileCount}</td>
                      <td className={css.colChange}>
                        +{commit.additions} / -{commit.deletions}
                      </td>
                      <td className={css.colFile}>
                        {commit.files
                          .map((f) => f.filename.split(".").pop())
                          .join(", ")}
                      </td>
                      <td className={css.colConsole}>
                        {commit.containsConsole ? "✅" : "❌"}
                      </td>
                      <td className={css.colScore}>{commit.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitDetect;
