import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import { getUserRepos } from "../apis/github";
import { getCommitTime } from "../utils/commitTime.js";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const CommitTimeChart = ({ username }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const allCommitDates = [];

        const repos = await getUserRepos(username, 1, 3); // 최근 3개만
        for (const repo of repos) {
          const res = await axios.get(
            `https://api.github.com/repos/${username}/${repo.name}/commits`,
            { params: { per_page: 20 } } // 각 레포당 20개
          );

          const commits = res.data;
          if (Array.isArray(commits)) {
            const dates = commits.map((c) => c.commit?.author?.date);
            allCommitDates.push(...dates);
          }
        }

        const timeStats = getCommitTime(allCommitDates);
        setChartData(timeStats);
      } catch (err) {
        console.error("❌ 차트 데이터 불러오기 실패", err);
      }
    };

    if (username) fetchCommits();
  }, [username]);

  return (
    <div>
      {chartData.length > 0 ? (
        <PieChart width={280} height={280}>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p style={{ textAlign: "center" }}>Loading chart...</p>
      )}
    </div>
  );
};

export default CommitTimeChart;
