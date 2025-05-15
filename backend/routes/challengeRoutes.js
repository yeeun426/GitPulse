// Express 모듈 불러오기 (라우터 생성에 사용)
const express = require("express");

// 컨트롤러 함수 불러오기 (참여, 전체 조회 기능)
const {
  joinChallenge, // POST /join - 챌린지 참여 처리
  getAllParticipants, // GET /all - 참여자 전체 조회
} = require("../controllers/challengeController");

// 라우터 인스턴스 생성
const router = express.Router();

// [POST] /api/challenge/join
// 챌린지에 새로 참여할 때 사용
router.post("/join", joinChallenge);

// [GET] /api/challenge/all
// 전체 참여자 목록을 조회할 때 사용
router.get("/all", getAllParticipants);

// 라우터 내보내기 (server.js에서 app.use("/api/challenge", router) 로 사용)
module.exports = router;

const { leaveChallenge } = require("../controllers/challengeController");
router.delete("/leave/:githubId", leaveChallenge);
