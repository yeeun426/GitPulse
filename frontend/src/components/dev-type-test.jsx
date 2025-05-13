import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";

import styles from "./DevTypeTest.module.css";

const questions = [
  {
    qNumber: "Q1",
    q: "새 프로젝트 시작! 첫 작업은?",
    options: [
      { text: "figma 보면서 폰트랑 여백부터 정리", type: "pikachu" },
      { text: "디렉토리 구조 짜고 API 엔드포인트 미리 정리", type: "backend" },
      { text: 'GPT에게 "이 앱 구조 어떻게 할까?" 물어보기', type: "gpt" },
      { text: "지난 프로젝트 데이터 보면서 트렌드 분석", type: "data" },
      { text: "주요 컴포넌트 이름에 감정선 담기 시작", type: "artist" },
      { text: "우선 유튜브 켜고 분위기 좀 내기", type: "deadline" },
    ],
  },
  {
    qNumber: "Q2",
    q: "팀 프로젝트에서 코드 합치기 전날 밤, 당신은?",
    options: [
      { text: "컴포넌트 스타일 수정하다 시간이 다 감", type: "pikachu" },
      { text: "merge conflict 날 생각에 이미 한숨", type: "backend" },
      { text: '"GPT야 merge 도와줘"라고 말함', type: "gpt" },
      { text: "데이터를 정규화할지 비정규화할지 고민 중", type: "data" },
      {
        text: "className이 왜 main-box-wrapper인지 여전히 불만",
        type: "artist",
      },
      { text: "그날 처음 VSCode 켬", type: "deadline" },
    ],
  },
  {
    qNumber: "Q3",
    q: "코드 리뷰를 받았는데, 리뷰어가 '여기 네이밍 다시 고민해보자'라고 했다. 당신은?",
    options: [
      { text: "그게 디자인적 맥락에 맞는데...?", type: "pikachu" },
      { text: "바꾸면 호출부 다 망가진다고요", type: "backend" },
      { text: "GPT한테 더 좋은 네이밍 요청함", type: "gpt" },
      { text: "네이밍 기준 데이터로 정리한 거라서 못 바꿈", type: "data" },
      { text: "이름에 담은 철학이 있는데...", type: "artist" },
      { text: "일단 바꿨고 이유는 모르겠음", type: "deadline" },
    ],
  },
  {
    qNumber: "Q4",
    q: "새로 알게 된 툴이나 기술을 접했을 때 당신의 반응은?",
    options: [
      { text: "이걸로 더 예쁜 UI 만들 수 있겠네", type: "pikachu" },
      { text: "성능 얼마나 나오는지 벤치마크 자료부터 찾음", type: "backend" },
      { text: 'GPT한테 "이거 요약해줘"', type: "gpt" },
      { text: "이 툴이 만든 데이터 구조부터 뜯어봄", type: "data" },
      { text: "클래스명 자동 완성 기능부터 실험", type: "artist" },
      { text: "북마크 해놓고 두 달 뒤에 다시 봄", type: "deadline" },
    ],
  },
  {
    qNumber: "Q5",
    q: '"1일 1커밋 챌린지"에 참여하게 됐다. 당신은?',
    options: [
      { text: "매일 색감과 여백을 조정해서 커밋", type: "pikachu" },
      { text: "어제 작업 나눠서 분할 커밋", type: "backend" },
      { text: "GPT한테 간단한 자동화 커밋 루틴 요청", type: "gpt" },
      { text: "커밋 내용마다 분석 태그를 붙여둠", type: "data" },
      { text: "매일 className을 바꾸며 영감을 얻음", type: "artist" },
      { text: "주말에 몰아서 7개 커밋", type: "deadline" },
    ],
  },
  {
    qNumber: "Q6",
    q: "협업 중 다른 팀원이 내 코드를 수정했다면?",
    options: [
      { text: "스타일 무너졌는지 먼저 확인", type: "pikachu" },
      { text: "로직 흐름 이상 없는지 diff부터 탐색", type: "backend" },
      { text: '"이거 왜 바꿨는지 GPT한테 요약 부탁"', type: "gpt" },
      { text: "수정된 부분 데이터 처리 흐름부터 점검", type: "data" },
      { text: "함수명 감성 떨어졌는지 확인", type: "artist" },
      { text: "아직 안 봤고 내일 확인할 예정", type: "deadline" },
    ],
  },
  {
    qNumber: "Q7",
    q: "회의 시간, 당신은 어떤 사람?",
    options: [
      { text: "컬러 팔레트랑 여백 고민하며 듣는 중", type: "pikachu" },
      { text: "API 명세 바로 정리하고 있음", type: "backend" },
      { text: "GPT에 회의 요약시키는 중", type: "gpt" },
      { text: "말한 내용 실시간으로 표로 정리", type: "data" },
      { text: "회의 안건에 감성적 네이밍 제안함", type: "artist" },
      { text: "회의 끝나고 '뭐라 했더라?' 생각 중", type: "deadline" },
    ],
  },
  {
    qNumber: "Q8",
    q: "버그가 발생했을 때 당신의 첫 반응은?",
    options: [
      { text: "UI 깨졌는지 먼저 확인함", type: "pikachu" },
      { text: "스택트레이스 로그부터 읽기 시작", type: "backend" },
      { text: '"GPT야 이 에러 무슨 뜻이야?"', type: "gpt" },
      { text: "어떤 데이터가 이상했는지 로그 추적", type: "data" },
      { text: "이 버그 이름 지어줘야겠다고 생각함", type: "artist" },
      { text: "그냥 새로고침 해봄", type: "deadline" },
    ],
  },
  {
    qNumber: "Q9",
    q: "완성한 페이지를 처음 공유할 때 드는 생각은?",
    options: [
      { text: "폰트랑 여백이 예쁘게 보일지 걱정", type: "pikachu" },
      { text: "요청 응답 속도 괜찮나 체크", type: "backend" },
      { text: "GPT한테 피드백 요약해달라고 할까?", type: "gpt" },
      { text: "데이터 흐름 설명할 준비 완료", type: "data" },
      {
        text: "이름 짓느라 고생한 컴포넌트 보여줄 생각에 설렘",
        type: "artist",
      },
      { text: "테스트 안 해봤는데 괜찮겠지?", type: "deadline" },
    ],
  },
  {
    qNumber: "Q10",
    q: "가장 집중 잘 되는 환경은?",
    options: [
      { text: "예쁜 UI 참고 자료 띄워놓은 듀얼 모니터", type: "pikachu" },
      { text: "터미널+코드만 있는 딥다크 모드", type: "backend" },
      { text: "GPT랑 대화창 켜놓고 진행", type: "gpt" },
      { text: "쿼리 콘솔과 로그창 열어둔 세팅", type: "data" },
      { text: "잔잔한 음악 + 색감 조화된 IDE 테마", type: "artist" },
      { text: "마감 전날의 긴장감", type: "deadline" },
    ],
  },
];

const results = {
  pikachu: {
    title: "💻 감성 가득 프론트엔드",
    desc: "디자인 안 예쁘면 커밋 안 해요. border-radius가 안 들어가면 분노 게이지가 차오르고, 협업툴보다 Figma랑 친해요. 말버릇은 '폰트 왜 이래요??'",

    color: "#d3fbef",
    character: "/img/pikachu-image.png", // 피카츄 이미지 경로
  },
  backend: {
    title: "⚙️ 고독한 백엔드",
    desc: "REST? 난 REST할 시간도 없어. 팀에선 조용히 살지만, 서버에선 절대 조용하지 않아요. Git log엔 항상 'fix: 버그 수정'만 남기고, 프론트엔드 요청이 3분 이상이면 '무슨 API를 이렇게 써요?'라고 해요.",

    color: "#1b234c",
    character: "/img/werewolf-image.png", // 늑대인간 이미지 경로
  },
  gpt: {
    title: "🤖 GPT 영혼 합체 AI 개발자",
    desc: "사실 이 기능은 내가 안 짰는데... 코드보다 프롬프트에 진심이고, 디버깅할 때 GPT랑 대화가 60줄이에요. 프론트, 백 상관없이 GPT가 다 해주죠.",

    color: "#c2f0fe",
    character: "/img/robot-image.png", // 로봇 이미지 경로
  },
  data: {
    title: "📊 숫자 덕후 데이터 집착러",
    desc: "사람보다 그래프가 더 솔직해요. 커밋보다 Recharts가 먼저고, 팀원들 이름 외우기보다 컬럼명 먼저 외워요. 코드 리뷰보다 SQL 튜닝이 더 재밌죠.",

    color: "#ffe9bb",
    character: "/img/data-analyst-image.png", // 데이터 분석가 이미지 경로
  },
  artist: {
    title: "🎨 클래스명 예술가",
    desc: "이 div에 영혼을 담았습니다. div 하나에도 스토리가 있고, className='soul-container emotion-center' 같은 걸 써요. 협업 시 팀원이 클래스명 보고 철학 질문을 하죠.",

    color: "#fee7ff",
    character: "/img/artist-image.png", // 예술가 이미지 경로
  },
  deadline: {
    title: "⌛ 마감형 괴물 커밋러",
    desc: "마감 1시간 전이면 1주일 분량 가능해요. 잔디밭은 주말에 몰아서 조성하고, 매일은 못 해도 몰아서 폭주하는 열정 폭탄이에요. 커밋 메시지 시간은 항상 23:59죠.",

    color: "#70578f",
    character: "/img/monster-image.png", // 괴물 이미지 경로
  },
};

const getSortedScores = (scores) =>
  Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

const DevTypeTest = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [isDone, setIsDone] = useState(false);
  const resultRef = useRef(null);

  const handleAnswer = (type) => {
    setScores((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    if (step + 1 >= questions.length) {
      setIsDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "dev-type-result.png";
      a.click();
    } catch (error) {
      console.error("이미지 저장 에러:", error);
      alert("이미지 저장에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleRestart = () => {
    setStep(0);
    setScores({});
    setIsDone(false);
  };

  const sortedScores = getSortedScores(scores);
  const topType = sortedScores[0]?.[0];
  const result = topType ? results[topType] : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <div>
            <h2>당신의 개발자 유형은?</h2>
          </div>
        </header>

        {!isDone ? (
          <section>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className={styles.questionBox}>
              <p className={styles.questionTitle}>
                {questions[step].qNumber}. {questions[step].q}
              </p>
              <div className={styles.options}>
                {questions[step].options.map((opt, i) => (
                  <button
                    key={opt.type + i}
                    onClick={() => handleAnswer(opt.type)}
                    className={styles.optionButton}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : result ? (
          <section className={styles.resultSection}>
            <div
              ref={resultRef}
              className={styles.resultCard}
              style={{
                backgroundColor: result.color,
                color:
                  result.color === "#1b234c" || result.color === "#70578f"
                    ? "#f0f0f0"
                    : "#1a202c",
              }}
            >
              <img
                src={result.character}
                alt={result.title}
                className={styles.resultImage}
              />
              <h3 className={styles.resultTitle}>{result.title}</h3>
              <p className={styles.resultDesc}>{result.desc}</p>
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={handleRestart} className={styles.retryButton}>
                다시 테스트하기
              </button>
              <button
                onClick={handleDownload}
                className={styles.downloadButton}
              >
                결과 이미지 저장
              </button>
              <a href="/news">
                <button className={styles.retryButton}>
                  프론트엔드 IT 뉴스 바로가기
                </button>
              </a>
            </div>
          </section>
        ) : (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>결과를 가져오고 있어요...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DevTypeTest;
