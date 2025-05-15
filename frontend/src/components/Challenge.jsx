import { useEffect, useState } from "react";
import {
  getAllParticipants,
  joinChallenge,
  getUserFromJWT,
  leaveChallenge,
} from "../apis/Challenge.js";

const Challenge = () => {
  const [participants, setParticipants] = useState([]);
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllParticipants();
        setParticipants(data);

        const user = getUserFromJWT();
        if (user) {
          const isJoined = data.some((p) => p.githubId === user.login);
          setAlreadyJoined(isJoined);
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
      setAlreadyJoined(true);
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
      setAlreadyJoined(false);
    } catch (e) {
      alert("❌ 참여 취소 실패");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔥 커밋 챌린지 참가자</h2>
      <button onClick={handleJoin} disabled={alreadyJoined}>
        {alreadyJoined ? "✅ 이미 참여함" : "챌린지 참여하기"}
      </button>

      {alreadyJoined && (
        <button onClick={handleLeave} style={{ marginLeft: "10px" }}>
          🚫 챌린지 취소
        </button>
      )}

      <ul style={{ marginTop: "20px" }}>
        {participants.map((p) => (
          <li key={p.githubId}>{p.githubId}</li>
        ))}
      </ul>
    </div>
  );
};

export default Challenge;
