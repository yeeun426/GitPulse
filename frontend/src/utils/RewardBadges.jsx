import {
  getUserRepos,
  getRepoCommits,
  getMergedPullRequests,
  getLanguageDiversity,
  getLateNightCommitDays,
  getUserCommitDates,
  getUserCreatedExternalIssues,
} from "../apis/github";

import React, { useEffect, useState } from "react";
import Badges from "../components/Badges";
import FirstCommit from "/img/1Commit image.svg";
import HundredCommit from "/img/100Commit image.svg";
import BestCoder from "/img/BestCoder image.svg";
import Bug from "/img/Bug Image.svg";
import Alchemy from "/img/Alchemy image.svg";
import Night from "/img/Night Owl image.svg";

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
          if (commits && Array.isArray(commits) && commits.length > 0) {
            earnedBadges.push(FirstCommit);
            break;
          }
        }

        // 100일 커밋
        const commitDayCount = await getUserCommitDates(username);
        if (commitDayCount >= 100) {
          earnedBadges.push(HundredCommit);
        }

        // PR 챔피언
        const mergedPRs = await getMergedPullRequests(username);
        if (mergedPRs >= 30) {
          earnedBadges.push(BestCoder);
        }

        // GitHub 연금술사
        const languageCount = await getLanguageDiversity(username);
        if (languageCount >= 5) {
          earnedBadges.push(Alchemy);
        }

        // 야행성 코더
        const lateNightDays = await getLateNightCommitDays(username);
        if (lateNightDays >= 30) {
          earnedBadges.push(Night);
        }

        //버그 사냥꾼
        const bugIssues = await getUserCreatedExternalIssues(username);
        if (bugIssues >= 10) {
          earnedBadges.push(Bug);
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
