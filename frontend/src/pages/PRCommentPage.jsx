import React, { useState } from "react";
import css from "./PRCommentPage.module.css";
import { useLocation } from "react-router-dom";
import { postReviewComment, usePRInfo } from "../apis/usePRComment";
import Markdown from "react-markdown";

const PRCommentPage = () => {
  const location = useLocation();
  const { url } = location.state || {};
  const [commentTargets, setCommentTargets] = useState({});

  const parts = url?.split("/");
  const orgs = parts[4];
  const repo = parts[5];
  const pullNumber = parts[7];

  const { data, isLoading, isError } = usePRInfo(orgs, repo, pullNumber);

  const { body, title, created_at, user } = data?.info || {};
  const prFiles = data?.files;
  const prComment = data?.comment;
  const commitId = data?.info?.head?.sha;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  console.log(prComment, prFiles);

  const handleCommentChange = (key, value) => {
    setCommentTargets((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className={css.prCommentCon}>
      <header>
        <h2>
          PR #{pullNumber} : {title}
        </h2>
        <div>{user.login}</div>
        <div>{created_at}</div>
      </header>
      <main>
        <div>
          {prFiles?.map((file, fileIndex) => (
            <div key={fileIndex} style={{ marginBottom: "1.5rem" }}>
              <h4>{file.filename}</h4>
              <pre>
                {file?.patch?.split("\n").map((line, lineIndex) => {
                  const key = `${file.filename}-${lineIndex}`;
                  let bgColor = "";
                  let color = "";
                  if (line.startsWith("+") && !line.startsWith("+++")) {
                    bgColor = "#e6ffed";
                    color = "#22863a";
                  } else if (line.startsWith("-") && !line.startsWith("---")) {
                    bgColor = "#ffeef0";
                    color = "#cb2431";
                  } else if (line.startsWith("@@")) {
                    bgColor = "#f0f0f0";
                    color = "#6a737d";
                  }

                  const isCommenting = commentTargets[key] !== undefined;

                  return (
                    <div
                      key={lineIndex}
                      style={{
                        backgroundColor: bgColor,
                        color,
                        padding: "4px",
                      }}
                    >
                      <div
                        onClick={() =>
                          handleCommentChange(key, commentTargets[key] || "")
                        }
                        style={{ cursor: "pointer" }}
                      >
                        {line}
                      </div>

                      {isCommenting && (
                        <div style={{ marginTop: "4px" }}>
                          <textarea
                            rows={2}
                            style={{ width: "100%" }}
                            value={commentTargets[key]}
                            onChange={(e) =>
                              handleCommentChange(key, e.target.value)
                            }
                          />
                          <button
                            onClick={() => {
                              const body = commentTargets[key];
                              const displayLine = extractLineNumberFromPatch(
                                file.patch,
                                lineIndex
                              );

                              if (!commitId || displayLine === null) {
                                alert(
                                  "커밋 ID 또는 줄 번호가 유효하지 않습니다."
                                );
                                return;
                              }

                              postReviewComment(
                                orgs,
                                repo,
                                pullNumber,
                                body,
                                commitId,
                                file.filename,
                                displayLine
                              );

                              handleCommentChange(key, undefined);
                            }}
                          >
                            리뷰 등록
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </pre>
            </div>
          ))}
        </div>

        <div className={css.prMdCon}>
          <Markdown>{body}</Markdown>
        </div>
        <div className={css.commentList}>
          {prComment?.map((comment, index) => (
            <div key={index} className={css.commentCon}>
              <img src={comment.user.avatar_url} />
              <div className={css.commentBody}>
                <div className={css.commentInfo}>
                  <div>{comment.user.login}</div>
                  <div>{comment.created_at.split("T")[0]}</div>
                </div>
                <div>{comment.body}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const extractLineNumberFromPatch = (patch, targetLineIndex) => {
  const lines = patch.split("\n");
  let actualLine = null;

  for (let i = 0, prLineNum = 0; i < lines.length; i++) {
    const line = lines[i];

    // Hunk 시작 (@@ +10,7 @@ 형태)
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+),?/);
      if (match) {
        prLineNum = parseInt(match[1], 10) - 1; // +라인에서 시작점
      }
      continue;
    }
    if (i === targetLineIndex) {
      actualLine = prLineNum;
      break;
    }
    // - 삭제된 줄은 PR에 없음, 줄 번호 증가 안 함
    if (line.startsWith("-") && !line.startsWith("---")) {
      continue;
    }
    // 나머지 줄은 PR에서 존재하는 줄 → PR 줄 번호 증가
    prLineNum++;
  }

  return actualLine;
};
export default PRCommentPage;
