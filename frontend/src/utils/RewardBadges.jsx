import {
  getUserRepos,
  getRepoCommits,
  getMergedPullRequests,
  getLanguageDiversity,
  getLateNightCommitDays,
} from "../apis/github";

import React, { useEffect, useState } from "react";
import Badges from "../components/Badges";
import badge1 from "/img/1Commit image.svg";
import badge2 from "/img/100Commit image.svg";
import badge3 from "/img/BestCoder image.svg";
import badge4 from "/img/Bug Image.svg";
import badge5 from "/img/Conflict image.svg";
import badge6 from "/img/Alchemy image.svg";
import badge7 from "/img/Night Owl image.svg";

const RewardBadges = ({ username }) => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const checkBadges = async () => {
      if (!username) return;
      const earnedBadges = [];

      try {
        const repos = await getUserRepos(username, 1, 10);

        // 첫 커밋
        for (const repo of repos) {
          const commits = await getRepoCommits(username, repo.name, 10);
          if (commits.length > 0) {
            earnedBadges.push(badge1);
            break;
          }
        }

        // 100일 커밋 자리

        // PR 챔피언
        const mergedPRs = await getMergedPullRequests(username);
        if (mergedPRs >= 30) {
          earnedBadges.push(badge3);
        }

        // GitHub 연금술사
        const languageCount = await getLanguageDiversity(username);
        if (languageCount >= 5) {
          earnedBadges.push(badge6);
        }

        // 야행성 코더
        const lateNightDays = await getLateNightCommitDays(username);
        if (lateNightDays >= 30) {
          earnedBadges.push(badge7);
        }

        setBadges(earnedBadges);
      } catch (err) {
        console.error("뱃지 확인 오류:", err);
      }
    };

    checkBadges();
  }, [username]);

  return <Badges badges={badges} />;
};

export default RewardBadges;
