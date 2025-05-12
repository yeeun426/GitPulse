import axios from "axios";

/**
 * GitHub 유저 정보 조회
 * @param {string} username - GitHub 사용자 ID
 * @returns {Promise<{followers: number, following: number, public_repos: number}>}
 */
export const getGitHubUserInfo = async (username) => {
  try {
    const res = await axios.get(`https://api.github.com/users/${username}`);
    console.log("GitHub 응답 데이터:", res.data);
    const { followers, following, public_repos, login, name, avatar_url } =
      res.data;
    return { followers, following, public_repos, login, name, avatar_url };
  } catch (error) {
    console.error("GitHub 유저 정보 요청 실패:", error);
    throw error;
  }
};

export const getUserRepos = async (username, page = 1, perPage = 5) => {
  try {
    const res = await axios.get(
      `https://api.github.com/users/${username}/repos`,
      {
        params: {
          page,
          per_page: perPage,
          sort: "pushed",
        },
      }
    );
    console.log("GitHub repo 응답 데이터:", res.data);
    return res.data.map((repo) => ({
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
