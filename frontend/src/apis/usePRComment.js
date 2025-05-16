import { useQuery } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "./github";

// PR 정보 불러오기
export const getPRInfo = async (orgs, repo, pullNumber) => {
  try {
    const [info, files, comment] = await Promise.all([
      fetchWithToken(`/repos/${orgs}/${repo}/pulls/${pullNumber}`),
      fetchWithToken(`/repos/${orgs}/${repo}/pulls/${pullNumber}/files`),
      fetchWithToken(`/repos/${orgs}/${repo}/issues/${pullNumber}/comments`),
    ]);
    return { info, files, comment };
  } catch (error) {
    console.log("조직 가져오기 실패", error);
    throw error;
  }
};

export const usePRInfo = (orgs, repo, pullNumber) => {
  return useQuery({
    queryKey: ["PRInfo", orgs, repo, pullNumber],
    queryFn: async () => {
      try {
        const data = pullNumber && (await getPRInfo(orgs, repo, pullNumber));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

export const postReviewComment = async (
  owner,
  repo,
  pullNumber,
  body,
  commitId,
  path,
  position
) => {
  try {
    console.log(owner, repo, pullNumber, body, commitId, path, position);
    console.log({
      body,
      commit_id: commitId,
      path,
      position,
    });
    const res = await postWithToken(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/comments`,
      {
        body,
        commit_id: commitId,
        path,
        position: position, // diff에서의 줄 번호
      }
    );
    return res;
  } catch (error) {
    console.error("comment달기 실패", error.response?.data || error);
    throw error;
  }
};
