import { useEffect, useState } from "react";
import {
  getAllParticipants,
  joinChallenge,
  getUserFromJWT,
  leaveChallenge,
} from "../apis/Challenge.js";

const Challenge = () => {
  const [participants, setParticipants] = useState([]);
  const [user, setUser] = useState(null);
  const [joinedCommit, setJoinedCommit] = useState(false);
  const [joinedContinue, setJoinedContinue] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        setParticipants(data);

        const u = getUserFromJWT();
        setUser(u);

        if (u) {
          const userData = data.find((p) => p.githubId === u.login);
          if (userData) {
            setJoinedCommit(!!userData.commit);
            setJoinedContinue(!!userData.continue);
          }
        }
      } catch (e) {
        alert("❌ 참여자 목록 불러오기 실패");
      }
    };
    load();
  }, []);

  const handleJoin = async (type) => {
    if (!user) {
      alert("🔐 로그인 후 참여 가능합니다.");
      return;
    }

    try {
      await joinChallenge({ githubId: user.login, type });
      alert("✅ 챌린지 참여 완료!");

      const updated = await getAllParticipants();
      setParticipants(updated);
      const userData = updated.find((p) => p.githubId === user.login);
      setJoinedCommit(!!userData?.commit);
      setJoinedContinue(!!userData?.continue);
    } catch (e) {
      alert("⚠️ 이미 참여했거나 오류가 발생했습니다.");
    }
  };

  const handleLeave = async (type) => {
    if (!user) {
      alert("🔐 로그인 후만 가능합니다.");
      return;
    }

    try {
      await leaveChallenge(user.login, type);
      alert(`🚫 ${type === "commit" ? "커밋왕" : "꾸준왕"} 취소 완료`);

      const updated = await getAllParticipants();
      setParticipants(updated);
      const userData = updated.find((p) => p.githubId === user.login);
      setJoinedCommit(!!userData?.commit);
      setJoinedContinue(!!userData?.continue);
    } catch (e) {
      alert("❌ 참여 취소 실패");
    }
  };

  const commitParticipants = participants.filter((p) => p.commit);
  const continueParticipants = participants.filter((p) => p.continue);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 커밋왕 & 꾸준왕 챌린지</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => handleJoin("commit")} disabled={joinedCommit}>
          {joinedCommit ? "✅ 커밋왕 참여중" : "💪 커밋왕 참여하기"}
        </button>

        <button
          onClick={() => handleJoin("continue")}
          disabled={joinedContinue}
          style={{ marginLeft: "10px" }}
        >
          {joinedContinue ? "✅ 꾸준왕 참여중" : "📅 꾸준왕 참여하기"}
        </button>

        {joinedCommit && (
          <button
            onClick={() => handleLeave("commit")}
            style={{ marginLeft: "10px" }}
          >
            🚫 커밋왕 취소
          </button>
        )}

        {joinedContinue && (
          <button
            onClick={() => handleLeave("continue")}
            style={{ marginLeft: "10px" }}
          >
            📭 꾸준왕 취소
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <div>
          <h4>💪 커밋왕 참가자</h4>
          <ul>
            {commitParticipants.map((p) => (
              <li key={p.githubId}>{p.githubId}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>📅 꾸준왕 참가자</h4>
          <ul>
            {continueParticipants.map((p) => (
              <li key={p.githubId}>{p.githubId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Challenge;
