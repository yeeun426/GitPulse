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
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
