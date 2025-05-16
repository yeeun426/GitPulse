import axios from "axios";

const API_BASE = "http://localhost:4000";

export const githubAxios = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const fetchWithToken = async (path, params = {}) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${API_BASE}/github/proxy`, {
    params: { path, ...params },
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

export const postWithToken = async (path, data = {}) => {
  const token = localStorage.getItem("jwt");

  // 경로가 이미 full이면 그대로 쓰고, 아니면 프록시 경로로
  // const isDirect = path.startsWith("/repos/"); // POST용 direct path 구분
  // const fullPath = isDirect
  //   ? `${API_BASE}/github${path}` // 예: /github/repos/:owner/:repo/...
  //   : `${API_BASE}/github/proxy${path}`; // 프록시 GET용

  const res = await axios.post(`${API_BASE}/github/proxy${path}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  return res.data;
};

export const getGitHubUserInfo = async (username) => {
  try {
    const res = await fetchWithToken(`/users/${username}`);
    const data = res.data || res;

    if (!data || data.message === "Not Found") {
      throw new Error("User not found");
    }

    const { followers, following, public_repos, login, name, avatar_url } =
      data;
    return { followers, following, public_repos, login, name, avatar_url };
  } catch (error) {
    console.error("GitHub 유저 정보 요청 실패:", error);
    throw error;
  }
};

export const fetchUserRepos = async (username, page = 1, perPage = 100) => {
  try {
    const data = await fetchWithToken(`/users/${username}/repos`, {
      page,
      per_page: perPage,
      sort: "pushed",
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch user repos:", err);
    throw err;
  }
};

export const getUserRepos = async (username, page = 1, perPage = 5) => {
  try {
    const res = await fetchWithToken(`/users/${username}/repos`, {
      page,
      per_page: perPage,
      sort: "pushed",
    });
    return res.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
    }));
  } catch (err) {
    console.error("사용자의 레포지토리 가져오기 실패", err);
    return [];
  }
};

export const getRepoCommits = async (username, repoName, perPage = 30) => {
  try {
    const res = await fetchWithToken(`/repos/${username}/${repoName}/commits`, {
      per_page: perPage,
    });
    return res;
  } catch (err) {
    const errorMsg = err?.response?.data?.message;
    if (errorMsg === "Git Repository is empty.") {
      console.warn(`${repoName}는 비어있는 레포입니다.`);
      return [];
    }
    console.error(`${repoName} Commit 불러오기 실패`, err);
    return [];
  }
};

export const getMergedPullRequests = async (username) => {
  try {
    const res = await fetchWithToken(`/search/issues`, {
      q: `author:${username} is:pr is:merged`,
    });
    return res.total_count;
  } catch (err) {
    console.error("병합된 PR 검색 실패", err);
    return 0;
  }
};

export const getLanguageDiversity = async (username) => {
  try {
    const repos = await fetchWithToken(`/users/${username}/repos`, {
      per_page: 100,
    });
    const languageSet = new Set();
    repos.forEach((repo) => {
      if (repo.language && repo.language !== "JavaScript") {
        languageSet.add(repo.language);
      }
    });
    return languageSet.size;
  } catch (err) {
    console.error("레포 언어 다변성 측정 실패", err);
    return 0;
  }
};

export const getLateNightCommitDays = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 5);
    const lateNightDays = new Set();

    for (const repo of repos) {
      const commits = await getRepoCommits(username, repo.name, 50);
      commits.forEach((c) => {
        const dateStr = c.commit?.author?.date;
        if (dateStr) {
          const date = new Date(dateStr);
          let hour = date.getUTCHours() + 9;
          if (hour >= 24) hour -= 24;
          if (hour >= 0 && hour <= 4) {
            const dayOnly = dateStr.slice(0, 10);
            lateNightDays.add(dayOnly);
          }
        }
      });
    }

    return lateNightDays.size;
  } catch (err) {
    console.error("야행성 커밋 계산 실패", err);
    return 0;
  }
};

export const getUserCommitDates = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 100);
    const dateSet = new Set();

    for (const repo of repos) {
      const commits = await getRepoCommits(username, repo.name, 100);
      commits.forEach((commit) => {
        if (commit?.commit?.author?.date) {
          const date = new Date(commit.commit.author.date)
            .toISOString()
            .split("T")[0];
          dateSet.add(date);
        }
      });
    }

    return dateSet.size;
  } catch (err) {
    console.error("100일 커밋 날짜 계산 실패", err);
    return 0;
  }
};

export const getUserCreatedExternalIssues = async (username) => {
  try {
    let page = 1;
    let allIssues = [];

    while (true) {
      const data = await fetchWithToken(`/search/issues`, {
        q: `author:${username} type:issue`,
        per_page: 100,
        page,
      });

      if (!data.items || data.items.length === 0) break;
      allIssues = allIssues.concat(data.items);
      if (data.items.length < 100) break;
      page++;
    }

    const externalIssues = allIssues.filter(
      (issue) => issue.repository?.owner?.login !== username
    );

    return externalIssues.length;
  } catch (err) {
    console.error("버그 사냥꾼 이슈 검색 실패", err);
    return 0;
  }
};

export const getUserCommitActivity = async (username) => {
  try {
    const dateSet = new Set();
    const todayKey = (() => {
      const d = new Date();
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
    })();

    for (let page = 1; page <= 3; page++) {
      const events = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });
      if (!Array.isArray(events) || events.length === 0) break;

      for (const e of events) {
        if (
          e.type === "PushEvent" ||
          (e.type === "PullRequestEvent" && e.payload.action === "merged") ||
          (e.type === "CreateEvent" && e.payload.ref_type === "repository")
        ) {
          const dt = new Date(e.created_at);
          const key = [
            dt.getFullYear(),
            String(dt.getMonth() + 1).padStart(2, "0"),
            String(dt.getDate()).padStart(2, "0"),
          ].join("-");
          dateSet.add(key);
        }
      }

      if (dateSet.has(todayKey)) break;
    }

    if (dateSet.size === 0) {
      return { streakDays: 0, missingDays: 999 };
    }

    const sorted = [...dateSet].sort((a, b) => (a < b ? 1 : -1));
    let streak = 0;
    let cursor = new Date(sorted[0]);
    while (true) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");
      if (!dateSet.has(key)) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    const lastDate = new Date(sorted[0]);
    const missing = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

    return { streakDays: streak, missingDays: missing };
  } catch (err) {
    console.error("활동 분석 실패:", err);
    return { streakDays: 0, missingDays: 999 };
  }
};

export const getRateLimit = async () => {
  return await fetchWithToken("/rate_limit");
};

export const getMonthlyCommitCount = async (username) => {
  try {
    const since = new Date();
    since.setMonth(since.getMonth() - 1);
    const sinceISOString = since.toISOString();

    const events = [];
    for (let page = 1; page <= 3; page++) {
      const res = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });

      if (!Array.isArray(res) || res.length === 0) break;

      res.forEach((event) => {
        if (event.type === "PushEvent" && event.created_at >= sinceISOString) {
          events.push(event);
        }
      });
    }

    let commitCount = 0;
    for (const e of events) {
      e.payload.commits.forEach(() => commitCount++);
    }

    return commitCount;
  } catch (err) {
    console.error("월간 커밋 수 가져오기 실패", err);
    return 0;
  }
};

export const getMonthlyCommitDays = async (username) => {
  try {
    const since = new Date();
    since.setMonth(since.getMonth() - 1);
    const sinceISOString = since.toISOString();
    const dateSet = new Set();

    for (let page = 1; page <= 3; page++) {
      const res = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });

      if (!Array.isArray(res) || res.length === 0) break;

      res.forEach((event) => {
        if (event.type === "PushEvent" && event.created_at >= sinceISOString) {
          const date = new Date(event.created_at).toISOString().split("T")[0];
          dateSet.add(date);
        }
      });
    }

    return dateSet.size;
  } catch (err) {
    console.error("월간 커밋 일수 가져오기 실패", err);
    return 0;
  }
};
