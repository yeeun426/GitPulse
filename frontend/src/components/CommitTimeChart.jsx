import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getUserRepos, getRepoCommits } from "../apis/github";
import { getCommitTime } from "../utils/commitTime";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

const CommitTimeChart = ({ username }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 최신 5개 레포 가져오기
        const repos = await getUserRepos(username, 1, 5);
        const allDates = [];

        // 각 레포에서 30개 커밋 가져와서 날짜만 추출
        for (const repo of repos) {
          const commits = await getRepoCommits(username, repo.name, 30);
          commits
            .map((c) => c.commit?.author?.date)
            .filter(Boolean)
            .forEach((d) => allDates.push(d));
        }

        // 시간대별 집계
        const stats = getCommitTime(allDates);
        setChartData(stats);
      } catch (err) {
        console.error("차트 데이터 불러오기 실패:", err);
      }
    };

    if (username) fetchData();
  }, [username]);

  const total = chartData.reduce((sum, cur) => sum + cur.value, 0);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      {chartData.length > 0 ? (
        <>
          <PieChart width={280} height={280}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label
            >
              {chartData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <div style={{ marginTop: 12 }}>
            {chartData.map((item) => (
              <p key={item.name} style={{ margin: 4, fontSize: 14 }}>
                {item.name}:{" "}
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%
              </p>
            ))}
          </div>
        </>
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default CommitTimeChart;
