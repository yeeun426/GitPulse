import { useEffect, useState } from "react";
import { fetchWithToken } from "../apis/github";

export const useSuspiciousCommits = ({ name, repo, commits }) => {
  const [suspiciousCommits, setSuspiciousCommits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!commits || !commits.length) return;

    const fetchSuspicious = async () => {
      setLoading(true);
      const results = [];

      for (const commit of commits) {
        try {
          const sha = commit.sha;
          const detail = await fetchWithToken(
            `/repos/${name}/${repo}/commits/${sha}`
          );

          const files = detail.files || [];
          const message = detail.commit.message;
          const additions = detail.stats.additions;
          const deletions = detail.stats.deletions;

          const shortMessage = message.length < 10;
          const smallChange = additions + deletions < 10;
          const singleFile = files.length <= 1;
          const onlyConsole = files.every((file) =>
            file.patch?.replace(/\s/g, "").includes("console.log")
          );
          const nonCodeFilesOnly = files.every((file) =>
            /\.(md|json|yml|lock|env|txt)$/i.test(file.filename)
          );

          const reasons = [];
          if (shortMessage) reasons.push("짧은 메시지");
          if (smallChange) reasons.push("변경량 적음");
          if (singleFile) reasons.push("1개 파일");
          if (onlyConsole) reasons.push("console만 있음");
          if (nonCodeFilesOnly) reasons.push("비코드 파일만");

          results.push({
            sha,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            message,
            additions,
            deletions,
            fileCount: files.length,
            files,
            containsConsole: onlyConsole,
            reasons,
            isSuspicious: reasons.length > 0,
          });
        } catch (err) {
          console.error("허수 분석 실패", err);
        }
      }
      setSuspiciousCommits(results);
      setLoading(false);
    };

    fetchSuspicious();
  }, [name, repo, commits]);

  return { suspiciousCommits, loading };
};
