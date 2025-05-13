import axios from "axios";

const API_BASE = "http://localhost:4000";

export const githubAxios = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const fetchWithToken = async (path, params = {}) => {
  const token = localStorage.getItem("jwt"); // JWT 꺼내고
  const res = await axios.get(`${API_BASE}/github/proxy`, {
    params: { path, ...params }, // path + params
    headers: { Authorization: `Bearer ${token}` }, //  헤더에 넣어서
    withCredentials: true, // 쿠키 전송(필요시)
  });
  return res.data; // 결과 데이터 리턴
};

export const getGitHubUserInfo = async (username) => {
  try {
    const res = await fetchWithToken(`/users/${username}`);
    console.log("GitHub 응답 데이터:", res.data);
    const { followers, following, public_repos, login, name, avatar_url } = res;
    return { followers, following, public_repos, login, name, avatar_url };
  } catch (error) {
    console.error("GitHub 유저 정보 요청 실패:", error);
    throw error;
  }
};

export const getUserRepos = async (username, page = 1, perPage = 5) => {
  try {
    const res = await fetchWithToken(`/users/${username}/repos`, {
      page,
      per_page: perPage,
      sort: "pushed",
    });
    console.log("GitHub repo 응답 데이터:", res.data);
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
    console.error(`${repoName} Commit 불러오기 실패`, err);
    return [];
  }
};

//PR횟수
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

//몇개언어
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

//커밋시간(야행성)
export const getLateNightCommitDays = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 5); // 최근 5개 repo
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
            // 0시~4시 사이
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

//요청 횟수 확인
export async function getRateLimit() {
  return await fetchWithToken("/rate_limit");
}
