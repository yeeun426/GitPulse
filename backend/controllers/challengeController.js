const Participant = require("../models/ChallengeParticipant");

exports.joinChallenge = async (req, res) => {
  const { githubId, type } = req.body;

  try {
    const exists = await Participant.findOne({ githubId });
    if (exists)
      return res.status(409).json({ message: "이미 참여한 유저입니다" });

    const newOne = new Participant({
      githubId,
      commit: type === "commit",
      continue: new Date(), // 지금 참여한 시점
    });

    const saved = await newOne.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "참여 실패", detail: err.message });
  }
};

exports.getAllParticipants = async (req, res) => {
  try {
    const all = await Participant.find().sort({ joinedAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "참여자 조회 실패" });
  }
};

exports.leaveChallenge = async (req, res) => {
  const { githubId } = req.params;
  try {
    const result = await Participant.findOneAndDelete({ githubId });
    if (!result) return res.status(404).json({ message: "참여자가 없습니다" });
    res.json({ message: "참여 취소 완료" });
  } catch (e) {
    res.status(500).json({ error: "참여 취소 실패", detail: e.message });
  }
};
