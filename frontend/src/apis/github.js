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
    // console.log("GitHub 응답 데이터:", res);
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
    // console.log("GitHub repo 응답 데이터:", res);
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

//100커밋
export const getUserCommitDates = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 100); // 최대 100개 repo
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

    return dateSet.size; // 서로 다른 날짜 수
  } catch (err) {
    console.error("100일 커밋 날짜 계산 실패", err);
    return 0;
  }
};

//버그사냥꾼
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

//코멘트 계산(커밋 한 날짜 기준 계산하기)
export const getUserCommitActivity = async (username) => {
  // console.log(`getUserCommitActivity: ${username}`);
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

    //최대 3페이지(300개)까지 순회
    for (let page = 1; page <= 3; page++) {
      const events = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });
      // console.log(`page ${page} 이벤트 수: ${events.length}`);
      if (!Array.isArray(events) || events.length === 0) break;

      //PushEvent만 골라서 로컬 YYYY-MM-DD로 dateSet에 추가
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

      //오늘 이벤트가 dateSet에 들어왔다면 더 이상 페이지 요청 안 함
      if (dateSet.has(todayKey)) {
        console.log("오늘 커밋 이벤트 발견, 페이지 순회 종료.");
        break;
      }
    }

    // console.log("커밋 날짜들:", [...dateSet].slice(0, 10));

    //커밋 하나도 없으면
    if (dateSet.size === 0) {
      console.log("커밋을 하나도 찾지 못함.");
      return { streakDays: 0, missingDays: 999 };
    }

    //최신 커밋일 찾아서 정렬
    const sorted = [...dateSet].sort((a, b) => (a < b ? 1 : -1));
    // console.log("정렬된 날짜 :", sorted.slice(0, 5));

    //최신 커밋일부터 연속 일수 계산
    let streak = 0;
    let cursor = new Date(sorted[0]);
    while (true) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");
      const has = dateSet.has(key);
      // console.log(`streak check ${key}: ${has}`);
      if (!has) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    // console.log(`streakDays: ${streak}`);

    //마지막 커밋 이후 경과일 계산
    const lastDate = new Date(sorted[0]);
    const missing = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
    // console.log(
    //   `마지막 커밋일: ${sorted[0]}, missingDays: ${missing}`
    // );

    return { streakDays: streak, missingDays: missing };
  } catch (err) {
    console.error("활동 분석 실패:", err);
    return { streakDays: 0, missingDays: 999 };
  }
};

//요청 횟수 확인
export async function getRateLimit() {
  return await fetchWithToken("/rate_limit");
}
