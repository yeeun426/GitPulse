import React, { useEffect, useState } from "react";
import css from "./ChallengeBox.module.css";
import challengeImage from "../assets/challenge-visual.png";
import medalImages from "../utils/medals"; // { gold, silver, bronze }
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge";
import {
  getAllUserCommitRepos,
  getMonthlyCommitDays,
  fetchRepos,
  getKRMonthRange,
} from "../apis/github";

const ChallengeBox = ({ title, type, onSelect }) => {
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [user, setUser] = useState(null);

  const loadData = async () => {
    const data = await getAllParticipants();
    const currentUser = getUserFromJWT();
    setUser(currentUser);

    // 년도/월 설정
    const year = 2025;
    const month = 5;
    const { since, until } = getKRMonthRange(year, month);

    let commitData = [];

    if (type === "commit") {
      //PushEvent가 아닌 실제 커밋 개수 기준
      commitData = await Promise.all(
        data
          .filter((p) => p.commit)
          .map(async (p) => {
            const commits = await getAllUserCommitRepos(
              p.githubId,
              since,
              until
            );
            return {
              githubId: p.githubId,
              count: commits.length,
            };
          })
      );
    } else if (type === "continue") {
      commitData = await Promise.all(
        data
          .filter((p) => p.continue)
          .map(async (p) => ({
            githubId: p.githubId,
            count: await getMonthlyCommitDays(p.githubId, since, until),
          }))
      );
    } else if (type === "star") {
      const repos = await fetchRepos("stars", 1);
      commitData = repos.map((repo) => ({
        repo,
        githubId: repo.full_name,
        count: repo.stargazers_count,
      }));
    }

    const sorted = [...commitData].sort((a, b) => b.count - a.count);
    setParticipants(sorted);

    if (currentUser) {
      if (type === "commit")
        setJoined(
          data.some((p) => p.githubId === currentUser.login && p.commit)
        );
      if (type === "continue")
        setJoined(
          data.some((p) => p.githubId === currentUser.login && p.continue)
        );
      if (type === "star") setJoined(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleJoin = async () => {
    if (!user) return alert("로그인 필요");
    await joinChallenge({ githubId: user.login, type });
    setJoined(true);
    loadData();
  };

  const handleLeave = async () => {
    if (!user) return;
    await leaveChallenge(user.login, type);
    setJoined(false);
    loadData();
  };

  const renderListItem = (item, index) => {
    const isRepo = type === "star";
    const label = isRepo ? item.repo.name : item.githubId;
    const count = item.count;
    const medal = medalImages[index];

    return (
      <li
        key={label}
        onClick={() => onSelect(isRepo ? item.repo : item.githubId)}
      >
        <div className={css.rank}>{medal ? "" : `${index + 1}th`}</div>
        {medal ? (
          <img className={css.medal} src={medal} alt="medal" />
        ) : (
          <div style={{ width: "3rem" }}></div> // 빈 칸 확보
        )}
        <div className={css.label}>{label}</div>
        <div className={css.count}>
          {type === "continue" ? `${count}일` : `${count}회`}
        </div>
      </li>
    );
  };

  return (
    <div className={`${css.box} ${!joined ? css.blurred : ""}`}>
      <p className={css.header}>{title}</p>

      <ul className={css.list}>
        {participants.map((p, i) => renderListItem(p, i))}
      </ul>

      {!joined && (
        <div className={css.overlay}>
          <img src={challengeImage} alt="배경" />
          <button className={css.joinButton} onClick={handleJoin}>
            참여하기
          </button>
        </div>
      )}

      {joined && type !== "star" && (
        <button className={css.leave} onClick={handleLeave}>
          참여 취소
        </button>
      )}
    </div>
  );
};

export default ChallengeBox;
