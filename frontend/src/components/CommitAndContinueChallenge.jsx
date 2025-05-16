import { useEffect, useState } from "react";
import styles from "./CommitKing.module.css";
import challengeImage from "../assets/challenge-visual.png";
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge.js";

const CommitAndContinueChallenge = ({ type }) => {
  const isCommit = type === "commit";
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        setParticipants(data);

        const user = getUserFromJWT();
        if (user) {
          const found = data.find((p) => p.githubId === user.login);
          setIsJoined(type === "commit" ? !!found?.commit : !!found?.continue);
        }
      } catch (e) {
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };

    load();
  }, [type]);

  const handleJoin = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type });
      alert("✅ 챌린지 참여 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      const found = updated.find((p) => p.githubId === user.login);
      setIsJoined(type === "commit" ? !!found?.commit : !!found?.continue);
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
      await leaveChallenge(user.login, type);
      alert("🚫 챌린지 참여 취소 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      const found = updated.find((p) => p.githubId === user.login);
      setIsJoined(type === "commit" ? !!found?.commit : !!found?.continue);
    } catch (e) {
      alert("❌ 참여 취소 실패");
    }
  };

  const title = isCommit ? "Commit King" : "Never Stop Challenge";
  const label = isCommit ? "💪 커밋왕" : "📅 꾸준왕";

  return (
    <div className={styles.container}>
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>{title}</p>
          </div>

          <ul className={styles.repoList}>
            {participants
              .filter((p) => (isCommit ? p.commit : p.continue))
              .map((p) => (
                <li key={p.githubId}>{p.githubId}</li>
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
            <p className={styles.title}>{title}</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              📅 꾸준왕 참여하기
            </button>
          </div>
        </div>
      )}

      {isJoined && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className={styles.joinButton} onClick={handleLeave}>
            🚫 꾸준왕 참여 취소
          </button>
        </div>
      )}
    </div>
  );
};

export default CommitAndContinueChallenge;
