import React, { useState } from "react";
import css from "./PRCommentPage.module.css";
import { useLocation } from "react-router-dom";
import { postPRComment, usePRInfo } from "../apis/usePRComment";
import Markdown from "react-markdown";

import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

const PRCommentPage = () => {
  const location = useLocation();
  const { url } = location.state || {};
  const [commentTargets, setCommentTargets] = useState({});
  const [generalComment, setGeneralComment] = useState("");

  const parts = url?.split("/");
  const orgs = parts[4];
  const repo = parts[5];
  const pullNumber = parts[7];

  const { data, isLoading, isError } = usePRInfo(orgs, repo, pullNumber);

  const { body, title, created_at, user, state, commits, changed_files } =
    data?.info || {};
  const prFiles = data?.files;
  const prComment = data?.comment;
  const commitId = data?.info?.head?.sha;

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  const handleCommentChange = (key, value) => {
    setCommentTargets((prev) => ({ ...prev, [key]: value }));
  };

  const getPositionInPatch = (patch, targetIndex) => {
    const lines = patch.split("\n");
    let position = 0;

    for (let i = 0; i <= targetIndex; i++) {
      const line = lines[i];
      if (line.startsWith("@@")) continue;
      if (line.startsWith("+++")) continue;
      if (line.startsWith("---")) continue;

      position++;
    }

    return position;
  };

  return (
    <div className={css.prCommentCon}>
      <header>
        <h2>
          PR #{pullNumber} : {title}
        </h2>
        <div className={css.prCommentDesc}>
          <div>작성자 : {user.login}</div>
          <div>날짜 : {created_at.split("T")[0]}</div>
          <div>state : {state}</div>
          <div>커밋 : {commits}개</div>
          <div>변경된 파일 : {changed_files}개</div>
        </div>
      </header>
      <main>
        <Tab.Container defaultActiveKey="pr-body">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="pr-body">PR 설명</Nav.Link>
                </Nav.Item>
                {prFiles?.map((file) => (
                  <Nav.Item key={file.filename}>
                    <Nav.Link eventKey={file.filename}>
                      {file.filename.split("/").pop()}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>

            <Col sm={9}>
              <Tab.Content>
                {/* PR 설명 탭 */}
                <Tab.Pane eventKey="pr-body">
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
                  <div>
                    <textarea
                      placeholder="이 PR에 대한 의견을 남겨보세요"
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                    />
                    <button
                      onClick={() =>
                        postPRComment(orgs, repo, pullNumber, generalComment)
                      }
                    >
                      일반 코멘트 등록
                    </button>
                  </div>
                </Tab.Pane>

                {/* 파일별 탭 */}
                {prFiles?.map((file) => (
                  <Tab.Pane key={file.filename} eventKey={file.filename}>
                    <h4>{file.filename}</h4>
                    <pre>
                      {file?.patch?.split("\n").map((line, lineIndex) => {
                        const key = `${file.filename}-${lineIndex}`;
                        let bgColor = "";
                        let color = "";
                        const isAddedLine =
                          line.startsWith("+") && !line.startsWith("+++");
                        const isRemovedLine =
                          line.startsWith("-") && !line.startsWith("---");
                        const isMetaLine = line.startsWith("@@");

                        if (isAddedLine) {
                          bgColor = "#e6ffed";
                          color = "#22863a";
                        } else if (isRemovedLine) {
                          bgColor = "#ffeef0";
                          color = "#cb2431";
                        } else if (isMetaLine) {
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
                              onClick={() => {
                                if (isAddedLine) {
                                  handleCommentChange(
                                    key,
                                    commentTargets[key] || ""
                                  );
                                }
                              }}
                              style={{
                                cursor: isAddedLine ? "pointer" : "default",
                              }}
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
                                    const position = getPositionInPatch(
                                      file.patch,
                                      lineIndex
                                    );

                                    if (!commitId || position === null) {
                                      alert(
                                        "커밋 ID 또는 position이 유효하지 않습니다."
                                      );
                                      return;
                                    }
                                    postPRComment(
                                      orgs,
                                      repo,
                                      pullNumber,
                                      body,
                                      commitId,
                                      file.filename,
                                      position
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
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </main>
    </div>
  );
};

export default PRCommentPage;
