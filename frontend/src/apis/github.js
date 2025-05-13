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

//요청 횟수 확인
export async function getRateLimit() {
  return await fetchWithToken("/rate_limit");
}
