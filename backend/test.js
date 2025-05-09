const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

app.get("/oauth/github", (req, res) => {
  const redirectUri = "http://localhost:4000/oauth/github/callback";
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}`;
  res.json({ url });
});

app.get("/oauth/github/callback", async (req, res) => {
  const code = req.query.code;
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
    },
    {
      headers: { Accept: "application/json" },
    }
  );

  const accessToken = tokenRes.data.access_token;

  const userRes = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  global.loggedInUser = userRes.data;
  res.send("<script>window.close()</script>");
});

app.get("/oauth/github/user", (req, res) => {
  res.json(global.loggedInUser || {});
});

app.listen(4000, () => {
  console.log("✅ 서버 실행 중: http://localhost:4000");
});
