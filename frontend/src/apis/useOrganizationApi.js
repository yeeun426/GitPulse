import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "./github";

// 사용자 이름으로 조직 불러오기
export const getOrganizationsByUser = async (username) => {
  try {
    const res = await fetchWithToken(`/users/${username}/orgs`);
    return res;
  } catch (error) {
    console.log("조직 가져오기 실패", error);
  }
};

export const useOrganizationList = (username) => {
  return useQuery({
    queryKey: ["OrganizationList", username],
    queryFn: async () => {
      try {
        const data = username && (await getOrganizationsByUser(username));
        return data.reverse();
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

// orgs 정보 불러오기
export const getOrgsInfo = async (org) => {
  try {
    const [members, repos] = await Promise.all([
      fetchWithToken(`/orgs/${org}/members`),
      fetchWithToken(`/orgs/${org}/repos`),
    ]);
    return {
      members,
      repos,
    };
  } catch (error) {
    console.log("조직 정보 가져오기 실패", error);
  }
};

export const useOrgsInfo = (org) => {
  return useQuery({
    queryKey: ["orgsInfo", org],
    queryFn: async () => {
      try {
        const data = org && (await getOrgsInfo(org));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

// 조직 repo 불러오기
export const getOrgsRepos = async (orgs, repo) => {
  try {
    const [commit, pulls] = await Promise.all([
      fetchWithToken(`/repos/${orgs}/${repo}/commits`),
      fetchWithToken(`/repos/${orgs}/${repo}/pulls`),
    ]);
    return {
      commit,
      pulls,
    };
  } catch (error) {
    console.log("조직 repo 가져오기 실패", error);
  }
};

export const useOrgsRepos = (orgs, repo) => {
  return useQuery({
    queryKey: ["orgsRepo", repo],
    queryFn: async () => {
      try {
        const data = repo && (await getOrgsRepos(orgs, repo));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
