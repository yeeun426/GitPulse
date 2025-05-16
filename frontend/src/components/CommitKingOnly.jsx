import React, { useEffect, useState } from "react";
import styles from "./CommitKing.module.css";
import challengeImage from "../assets/challenge-visual.png";
import goldmedal from "../assets/gold.png";
import silvermedal from "../assets/silver.png";
import bronzemedal from "../assets/bronze.png";
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge.js";
import { getMonthlyCommitCount } from "../apis/github";
import RepoRankcopy from "./RepoRankcopy";

const CommitKingOnly = ({ selectedUser, setSelectedUser }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [topCommitUser, setTopCommitUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        const user = getUserFromJWT();

        const withCommitCounts = await Promise.all(
          data.map(async (p) => {
            const count = await getMonthlyCommitCount(p.githubId);
            return { ...p, commitCount: count };
          })
        );

        setParticipants(withCommitCounts);

        if (user) {
          const isUserJoined = withCommitCounts.some(
            (p) => p.githubId === user.login
          );
          setIsJoined(isUserJoined);

          const sorted = [...withCommitCounts].sort(
            (a, b) => b.commitCount - a.commitCount
          );
          const current = sorted.find((p) => p.githubId === user.login);
          const rank = sorted.findIndex((p) => p.githubId === user.login) + 1;

          setCurrentUser(current);
          setCurrentUserRank(rank);
          setTopCommitUser(sorted[0]);
        }
      } catch (e) {
        console.error(e);
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };

    load();
  }, []);

  const handleUserClick = (githubId) => {
    setSelectedUser(githubId);
  };

  const handleJoin = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type: "commit" });
      alert("✅ 커밋왕 참여 완료!");

      const userCommitCount = await getMonthlyCommitCount(user.login);
      const newUser = { githubId: user.login, commitCount: userCommitCount };

      const existing = await getAllParticipants();
      const othersWithCounts = await Promise.all(
        existing.map(async (p) => {
          const count = await getMonthlyCommitCount(p.githubId);
          return { ...p, commitCount: count };
        })
      );

      const alreadyExists = othersWithCounts.some(
        (p) => p.githubId === user.login
      );
      const updatedList = alreadyExists
        ? othersWithCounts
        : [...othersWithCounts, newUser];

      const sorted = updatedList.sort((a, b) => b.commitCount - a.commitCount);
      const rank = sorted.findIndex((p) => p.githubId === user.login) + 1;

      setParticipants(sorted);
      setIsJoined(true);
      setCurrentUser(newUser);
      setCurrentUserRank(rank);
      setTopCommitUser(sorted[0]);
    } catch (e) {
      alert("⚠️ 이미 참여했거나 오류가 발생했습니다.");
    }
  };

  const handleLeave = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후만 가능합니다.");
      return;
    }

    try {
      await leaveChallenge(user.login, "commit");
      alert("참여 취소 완료!");

      const data = await getAllParticipants();
      const withCommitCounts = await Promise.all(
        data.map(async (p) => {
          const count = await getMonthlyCommitCount(p.githubId);
          return { ...p, commitCount: count };
        })
      );

      const updatedList = withCommitCounts.filter(
        (p) => p.githubId !== user.login
      );

      const sorted = updatedList.sort((a, b) => b.commitCount - a.commitCount);

      setParticipants(sorted);
      setIsJoined(false);
      setCurrentUser(null);
      setCurrentUserRank(null);
      setTopCommitUser(sorted[0] ?? null);
      setSelectedUser(null);
    } catch (e) {
      console.error(e);
      alert("❌ 참여 취소 실패");
    }
  };

  const commitParticipants = [...participants]
    .filter((p) => p.commitCount > 0)
    .sort((a, b) => b.commitCount - a.commitCount);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Commit's Challenge</p>
          </div>

          <ul className={styles.repoList}>
            {commitParticipants.map((p, index) => (
              <li key={p.githubId}>
                {index === 0 ? (
                  <>
                    <img
                      src={goldmedal}
                      alt="1위"
                      style={{
                        width: "24px",
                        verticalAlign: "middle",
                        marginRight: "6px",
                      }}
                    />
                    {p.githubId} ({p.commitCount ?? 0} commits)
                  </>
                ) : index === 1 ? (
                  <>
                    <img
                      src={silvermedal}
                      alt="2위"
                      style={{
                        width: "24px",
                        verticalAlign: "middle",
                        marginRight: "6px",
                      }}
                    />
                    {p.githubId} ({p.commitCount ?? 0} commits)
                  </>
                ) : index === 2 ? (
                  <>
                    <img
                      src={bronzemedal}
                      alt="3위"
                      style={{
                        width: "24px",
                        verticalAlign: "middle",
                        marginRight: "6px",
                      }}
                    />
                    {p.githubId} ({p.commitCount ?? 0} commits)
                  </>
                ) : (
                  <>
                    {index + 1}위 - {p.githubId} ({p.commitCount ?? 0} commits)
                  </>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>

      {!isJoined && (
        <div className={styles.joinOverlay}>
          <div className={styles.joinBox}>
            <p className={styles.title}>Commit King</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>
      )}

      {isJoined && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className={styles.joinButton} onClick={handleLeave}>
            참여 취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommitKingOnly;
