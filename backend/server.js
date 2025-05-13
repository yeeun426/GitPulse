const express = require("express");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

//CORS 설정
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

//환경변수 & JWT Secret
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret_key";

//메모리 저장소
const userAccessTokens = {};

// Step 1. 클라이언트를 위한 GitHub OAuth URL 발급
app.get("/oauth/github", (req, res) => {
  const redirectUri = "http://localhost:4000/oauth/github/callback";
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
  res.json({ url });
});

// Step 2. GitHub OAuth 콜백 → access_token 받아오기
app.get("/oauth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // Step 3. GitHub 유저 정보 요청
    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = userRes.data;
    const username = user.login;

    //Step 3.5 accessToken 서버 메모리에 저장
    userAccessTokens[username] = accessToken;

    // Step 4. JWT 발급
    const jwtToken = jwt.sign(
      {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Step 5. postMessage로 프론트에 전달
    res.send(`
      <script>
        window.opener.postMessage('${jwtToken}', '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("OAuth 실패:", error);
    res.status(500).send("GitHub OAuth 실패");
  }
});

// 인증 프록시(미들웨어어)
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "인증 토큰 없음" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
}

// Commit Time Chart API (토큰은 서버가 가지고 있으니 username만 필요)
app.get("/github/proxy", authenticate, async (req, res) => {
  const { path, ...params } = req.query;
  const username = req.user.login;
  const accessToken = userAccessTokens[username];
  if (!accessToken)
    return res.status(404).json({ message: "AccessToken 없음" });

  try {
    const githubRes = await axios.get(`https://api.github.com${path}`, {
      params,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    });
    res.json(githubRes.data);
  } catch (err) {
    console.error("Proxy 실패:", err.response?.data || err.message);
    res.status(500).json({ message: "GitHub 호출 실패" });
  }
});

app.listen(4000, () => {
  console.log("✅ 백엔드 서버 실행 중 http://localhost:4000");
});

app.get("/", (req, res) => {
  res.send("✅ GitHub OAuth 서버 작동 중");
});

const res = await axios.get("http://localhost:4000/github/proxy", {
  params: { path: `/users/${username}` },
  withCredentials: true,
});

console.log("전체 한도:", res.headers["x-ratelimit-limit"]);
console.log("남은 횟수:", res.headers["x-ratelimit-remaining"]);
console.log("리셋 시각 (초):", res.headers["x-ratelimit-reset"]);
