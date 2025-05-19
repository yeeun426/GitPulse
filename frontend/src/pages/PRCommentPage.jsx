import React, { useState } from "react";
import css from "./PRCommentPage.module.css";
import { useLocation } from "react-router-dom";
import {
  postPRComment,
  usePRInfo,
  usePRLineReviews,
} from "../apis/usePRComment";
import Markdown from "react-markdown";

import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

import PrCommentHeader from "../components/PrCommentHeader.jsx";

const PRCommentPage = () => {
  const location = useLocation();
  const { url } = location.state || {};
  const [commentTargets, setCommentTargets] = useState({});
  const [generalComment, setGeneralComment] = useState("");
  const [expandedLines, setExpandedLines] = useState({});

  const [isCommentLoading, setIsCommentLoading] = useState(false);

  const parts = url?.split("/");
  const orgs = parts[4];
  const repo = parts[5];
  const pullNumber = parts[7];

  const { data, isLoading, isError, refetch } = usePRInfo(
    orgs,
    repo,
    pullNumber
  );
  const {
    data: reviewComments,
    isLoading: isReviewLoading,
    refetch: refetchReviewComments,
  } = usePRLineReviews(orgs, repo, pullNumber);

  console.log(reviewComments);
  const { body } = data?.info || {};
  const prFiles = data?.files;
  const prComment = data?.comment;
  const commitId = data?.info?.head?.sha;

  if (isLoading || isReviewLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  const handleCommentChange = (key, value) => {
    setCommentTargets((prev) => ({ ...prev, [key]: value }));
  };

  const handlePRComment = async (orgs, repo, pullNumber, generalComment) => {
    try {
      setIsCommentLoading(true);
      await postPRComment(orgs, repo, pullNumber, generalComment);
      setGeneralComment("");
      await refetch(); // 리렌더링을 위한 데이터 다시 불러오기
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentLoading(false);
    }
  };

  const getPositionInPatch = (patch, lineIndex) => {
    const lines = patch.split("\n");
    let position = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // 무시할 줄들
      if (
        line.startsWith("@@") ||
        line.startsWith("+++") ||
        line.startsWith("---")
      ) {
        continue;
      }
      // lineIndex 번째 줄이면
      if (i === lineIndex) {
        // 그 줄이 추가된 줄이라면 position 리턴
        if (line.startsWith("+") && !line.startsWith("+++")) {
          return position;
        } else {
          return null; // 추가된 줄이 아니면 position 못 찾음
        }
      }
      // 위치 계산 - 추가된 줄만 포함
      if (line.startsWith("+") && !line.startsWith("+++")) {
        position++;
      }
    }
    return null;
  };

  const getCommentsForLine = (filename, lineIndex, patch, comments) => {
    return (
      comments?.filter((comment) => {
        return (
          comment.path === filename &&
          getPositionInPatch(patch, lineIndex) === comment.position
        );
      }) || []
    );
  };

  return (
    <div className={css.prCommentCon}>
      <PrCommentHeader info={data?.info} pullNumber={pullNumber} />
      <main>
        <Tab.Container defaultActiveKey="pr-body">
          <Row>
            <Col className={css.prSidebar} sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="pr-body">코드 변경 요약</Nav.Link>
                </Nav.Item>
                {prFiles?.map((file) => (
                  <Nav.Item key={file.filename}>
                    <Nav.Link className={css.fileName} eventKey={file.filename}>
                      <span className="text-ellipsis">
                        {file.filename.split("/").pop()}
                      </span>
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Col>

            <Col className={css.prCon} sm={9}>
              <Tab.Content>
                {/* 코드 변경 요약 탭 */}
                <Tab.Pane eventKey="pr-body">
                  <h4>코드 변경 요약</h4>
                  <div className={css.prMdCon}>
                    <Markdown>{body}</Markdown>
                  </div>

                  <div className={css.commentList}>
                    {prComment?.map((comment, index) => (
                      <div key={index} className={css.commentCon}>
                        <img src={comment.user.avatar_url} />
                        <div className={css.commentBody}>
                          <div className={css.commentInfo}>
                            <div className={css.commentUser}>
                              {comment.user.login}
                            </div>
                            <div className={css.commentDate}>
                              {comment.created_at.split("T")[0]}
                            </div>
                          </div>
                          <div>{comment.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={css.commentInput}>
                    <textarea
                      placeholder="이 PR에 대한 의견을 남겨보세요"
                      value={generalComment}
                      onChange={(e) => setGeneralComment(e.target.value)}
                    />
                    <button
                      disabled={isCommentLoading}
                      onClick={() =>
                        handlePRComment(orgs, repo, pullNumber, generalComment)
                      }
                    >
                      Comment
                    </button>
                  </div>
                </Tab.Pane>

                {/* 파일별 탭 */}
                {prFiles?.map((file) => (
                  <Tab.Pane key={file.filename} eventKey={file.filename}>
                    <h4>{file.filename}</h4>
                    <pre className={css.codeBlock}>
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

                        const commentsForLine = getCommentsForLine(
                          file.filename,
                          lineIndex,
                          file.patch,
                          reviewComments
                        );

                        const hasComments = commentsForLine.length > 0;
                        const isExpanded = expandedLines[key];

                        return (
                          <div
                            key={lineIndex}
                            className={css.codeLineWrapper}
                            style={{
                              backgroundColor: bgColor,
                              color,
                              display: "flex",
                              padding: "2px 0",
                              flexDirection: "column",
                            }}
                          >
                            {/* 줄 번호 + 코드 한 줄 */}
                            <div style={{ display: "flex", width: "100%" }}>
                              {/* 줄 번호 및 댓글 아이콘 */}
                              <div
                                style={{
                                  width: "50px",
                                  paddingLeft: "8px",
                                  paddingRight: "8px",
                                  textAlign: "right",
                                  userSelect: "none",
                                  color: "#999",
                                }}
                              >
                                {lineIndex + 1}
                                {hasComments && (
                                  <span
                                    className={css.isComment}
                                    style={{ marginLeft: 10 }}
                                  >
                                    💜
                                  </span>
                                )}
                              </div>

                              {/* 코드 줄 내용 */}
                              <div
                                style={{
                                  flex: 1,
                                  whiteSpace: "pre-wrap",
                                  cursor: isAddedLine ? "pointer" : "default",
                                }}
                                onClick={() => {
                                  if (isAddedLine) {
                                    setExpandedLines((prev) => ({
                                      ...prev,
                                      [key]: !prev[key],
                                    }));
                                  }
                                }}
                              >
                                {line}
                              </div>
                            </div>

                            {/* 댓글 목록 + 작성창 (클릭 시에만 보여줌) */}
                            {isExpanded && (
                              <div
                                style={{
                                  flexBasis: "100%",
                                  marginLeft: "50px",
                                  marginTop: "4px",
                                }}
                              >
                                {/* 댓글 목록 */}
                                {commentsForLine.map((cmt, i) => (
                                  <div key={i} className={css.commentBody}>
                                    <div className={css.commentInfo}>
                                      <div className={css.commentUser}>
                                        {cmt.user.login}
                                      </div>
                                      <div>{cmt.created_at.split("T")[0]}</div>
                                    </div>
                                    <div className={css.lineBody}>
                                      {cmt.body}
                                    </div>
                                  </div>
                                ))}

                                {/* 댓글 작성 창 */}
                                <div className={css.lineComment}>
                                  <textarea
                                    rows={2}
                                    style={{ width: "100%" }}
                                    value={commentTargets[key] || ""}
                                    onChange={(e) =>
                                      handleCommentChange(key, e.target.value)
                                    }
                                  />
                                  <button
                                    onClick={async () => {
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

                                      await postPRComment(
                                        orgs,
                                        repo,
                                        pullNumber,
                                        body,
                                        commitId,
                                        file.filename,
                                        position
                                      );

                                      await refetchReviewComments();
                                      handleCommentChange(key, undefined);
                                    }}
                                  >
                                    리뷰 등록
                                  </button>
                                </div>
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
