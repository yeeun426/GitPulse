import axios from "axios";

// ✅ 백엔드 프록시 경로 설정
const github = axios.create({
  baseURL: "http://localhost:4000/github/proxy",
});

/**
 * 🔍 GitHub 유저 정보 조회
 */
export const getGitHubUserInfo = async (username) => {
  const token = localStorage.getItem("jwt");

  try {
    const res = await github.get("", {
      params: {
        path: `/users/${username}`,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { followers, following, public_repos, login, name, avatar_url } =
      res.data;
    return { followers, following, public_repos, login, name, avatar_url };
  } catch (error) {
    console.error("❌ GitHub 유저 정보 요청 실패:", error);
    throw error;
  }
};

/**
 * 📄 특정 레포지토리의 README.md 불러오기
 */
export const fetchReadme = async (owner, repo) => {
  const token = localStorage.getItem("jwt");

  try {
    const res = await github.get("", {
      params: {
        path: `/repos/${owner}/${repo}/readme`,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3.raw", // ✅ 반드시 raw 설정 필요
      },
    });

    return typeof res.data === "string" ? res.data : res.data.content;
  } catch (error) {
    console.error("❌ README.md 로딩 실패:", error);
    return "README.md 를 불러올 수 없습니다.";
  }
};

/**
 * 📊 레포지토리 목록 조회 (정렬 + 페이지네이션 지원)
 * @param {"stars" | "updated" | "created"} sort - 정렬 기준
 * @param {number} page - 페이지 번호 (1부터 시작)
 */
export const fetchRepos = async (sort = "stars", page = 1) => {
  const token = localStorage.getItem("jwt");

  let query = "stars:>100";

  if (sort === "created") {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    const formattedDate = oneYearAgo.toISOString().split("T")[0];
    query = `created:>${formattedDate}`;
  }

  try {
    const res = await github.get("", {
      params: {
        path: "/search/repositories",
        q: query,
        sort,
        order: "desc",
        per_page: 10,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data.items;
  } catch (error) {
    console.error("❌ 레포지토리 로딩 실패:", error);
    throw error;
  }
};
