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
