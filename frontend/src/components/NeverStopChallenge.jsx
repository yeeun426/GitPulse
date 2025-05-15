import { useEffect, useState } from "react";
import styles from "./NeverStopChallenge.module.css";
import challengeImage from "../assets/challenge-visual.png";
import {
  getAllParticipants,
  joinChallenge,
  leaveChallenge,
  getUserFromJWT,
} from "../apis/Challenge.js";

const NeverStopChallenge = () => {
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);

  // 참여자 정보 및 사용자 참여 여부 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        setParticipants(data);

        const user = getUserFromJWT();
        if (user) {
          const isUserJoined = data.some((p) => p.githubId === user.login);
          setIsJoined(isUserJoined);
        }
      } catch (e) {
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };

    load();
  }, []);

  const handleJoin = async () => {
    const user = getUserFromJWT();
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type: "commit" });
      alert("✅ 챌린지 참여 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      setIsJoined(true);
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
      await leaveChallenge(user.login);
      alert("🚫 챌린지 참여 취소 완료!");
      const updated = await getAllParticipants();
      setParticipants(updated);
      setIsJoined(false);
    } catch (e) {
      alert("❌ 참여 취소 실패");
    }
  };

  return (
    <div className={styles.container}>
      {/* 내용: 블러 처리 여부는 isJoined에 따라 */}
      <div
        className={`${styles.contentBox} ${!isJoined ? styles.blurred : ""}`}
      >
        <div className={styles.repoListBox}>
          <div>
            <p className={styles.commitLabel}>Never Stop Challenge</p>
          </div>

          <ul className={styles.repoList}>
            {participants.map((p) => (
              <li key={p.githubId}>{p.githubId}</li>
            ))}
          </ul>

          <div className={styles.pagination}>
            <div className={styles.empty}></div>
          </div>
        </div>
      </div>

      {/* 오버레이: 참가 전일 때만 표시 */}
      {!isJoined && (
        <div className={styles.joinOverlay}>
          <div className={styles.joinBox}>
            <p className={styles.title}>Never Stop Challenge</p>
            <img src={challengeImage} alt="챌린지 대표 이미지" />
            <button className={styles.joinButton} onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>
      )}

      {/* 참여한 상태면 "참여 취소" 버튼 제공 */}
      {isJoined && (
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <button className={styles.joinButton} onClick={handleLeave}>
            🚫 참여 취소
          </button>
        </div>
      )}
    </div>
  );
};

export default NeverStopChallenge;
