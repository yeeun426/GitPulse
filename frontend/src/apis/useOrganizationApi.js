import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "https://api.github.com";

// 사용자 이름으로 조직 불러오기
export const getOrganizationsByUser = async (username) => {
  try {
    const res = await axios.get(`${BASE_URL}/users/${username}/orgs`);
    return res.data;
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
      axios.get(`${BASE_URL}/orgs/${org}/members`),
      axios.get(`${BASE_URL}/orgs/${org}/repos`),
    ]);
    return {
      members: members.data,
      repos: repos.data,
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
