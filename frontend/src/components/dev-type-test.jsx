import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import IntroPage from "./IntroPage"
import css from "./DevTypeTest.module.css";

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
    q: "코드 리뷰를 받았는데, '여기 네이밍 다시 고민해보자'라고 했다. 당신은?",
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
    desc: [
      "디자인 픽셀 하나 어긋나면 혼잣말로",
      "'이건 아니지...'를 속삭이며 새벽까지 수정을 감행해요.",
      "border-radius가 빠지면 가시가 돋히고,",
      "그림자에 진심이라 box-shadow에도 30분 고민해요.",
      "협업툴? Notion보단 Figma랑 대화가 더 잘 통해요.",
      "컴포넌트는 곧 친구.",
      "‘폰트 왜 이래요??’는 거의 입버릇이고,",
      "시스템 폰트는 절대 못 참아요.",
    ],
    color: "#d3fbef",
    character: "/img/pikachu-image.png",
  },
  backend: {
    title: "⚙️ 고독한 백엔드",
    desc: [
      "API 문서보다 로그 파일을 더 많이 봐요.",
      "로그가 내 친구, 오류가 내 적.",
      "조용한 성격이지만 서버가 터지면 눈빛이 바뀌고,",
      "침묵은 코드로 말해요.",
      "커밋 메시지는 거의 자동완성",
      "'fix: 버그 수정', 'hotfix: 서버 장애'만 반복돼요.",
      "3분 이상 걸리는 API?",
      "그건 이미 전쟁 선포. 최적화 없이는 못 살아남아요.",
    ],
    color: "#1b234c",
    character: "/img/werewolf-image.png",
  },
  gpt: {
    title: "🤖 GPT 영혼 합체 AI 개발자",
    desc: [
      "내가 짰다고 말했지만,",
      "사실 그 코드... GPT가 도와줬어요.",
      "거의 공동 저자 수준.",
      "프롬프트 작성에 진심이고,",
      "'이걸 어떻게 물어보지?'에 하루를 써요.",
      "디버깅할 때 GPT 대화창에 소설을 써놓고,",
      "'이제 GPT가 고쳐줄 거야'라는 믿음을 갖고 있죠.",
      "프론트든 백이든 'GPT한테 물어보자'가 기본이에요.",
    ],
    color: "#c2f0fe",
    character: "/img/robot-image.png",
  },
  data: {
    title: "📊 숫자 덕후 데이터 집착러",
    desc: [
      "엑셀보다 SQL이 편하고,",
      "팀원들 감정보다 그래프 기울기에 더 민감해요.",
      "Recharts로 시각화된 데이터만 보면 괜히 흐뭇해지고, 그래프에 혼을 불어넣어요.",
      "컬럼명 외우는 속도는 팀원 얼굴 외우는 속도의 3배.",
      "DB schema가 뇌리에 새겨져 있어요.",
      "코드 리뷰? 그것보다 인덱스 튜닝이 더 흥미롭고,",
      "옵티마이저가 친구예요.",
    ],
    color: "#ffe9bb",
    character: "/img/data-analyst-image.png",
  },
  artist: {
    title: "🎨 클래스명 예술가",
    desc: [
      "클래스명을 지을 때 10분은 기본.",
      "‘이 div에는 어떤 의미가 담겨야 하지?’라는 고민을 해요.",
      "그저 배치가 아닌, div마다 서사가 있고,",
      "마진은 감정선 조절이에요.",
      "tailwind 쓰면서도 철학을 담고,",
      "클래스명 하나에 감정을 표현하려 해요.",
      "팀원이 내 코드를 보고",
      "'이 div 왜 이래요?'라며 존재론적 질문을 해요.",
    ],
    color: "#fee7ff",
    character: "/img/artist-image.png",
  },
  deadline: {
    title: "⌛ 마감형 괴물 커밋러",
    desc: [
      "마감 전 1시간이면 무아지경.",
      "그동안 뭐 했냐는 말에 ‘지금 집중하면 돼’라고 말해요.",
      "주중엔 잔디가 비어 있지만,",
      "주말엔 커밋 폭탄으로 서버를 흔들어요.",
      "슬슬 해야지 하다가 D-1에 광속 입력 시작.",
      "집중력은 그제야 터져요.",
      "커밋 시간은 항상 23:59. 시간은 나를 이기지 못해요.",
    ],
    color: "#70578f",
    character: "/img/monster-image.png",
  },
};

const getSortedScores = (scores) =>
  Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

const DevTypeTest = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [isDone, setIsDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
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
      const dataUrl = await toPng(resultRef.current, {
        backgroundColor: "#ffffff", // 흰색 배경 추가
      });
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
    setShowIntro(true);
    setStep(0);
    setScores({});
    setIsDone(false);
  };

  const sortedScores = getSortedScores(scores);
  const topType = sortedScores[0]?.[0];
  const result = topType ? results[topType] : undefined;
  const navigate = useNavigate();
  return (
    <div className={css.main}>
      {/* 질문화면과 결과화면을 분리하는 최상위 div 구조 */}
      {showIntro ? (
        <IntroPage onStart={() => setShowIntro(false)} />
      ) : !isDone ? (
        <>
          <div className={css.header}></div>
          <div className={css.progressWrapper}>
            <div className={css.progressBar}>
              <div
                className={css.progressFill}
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className={css.progressText}>
              {step + 1}/{questions.length}
            </div>
          </div>
          <section className={css.section}>
            <div className={css.questionBox}>
              <div className={css.questionTitle}>
                <p className={css.questionNumber}>{questions[step].qNumber}.</p>
                <p className={css.questionText}>{questions[step].q}</p>
              </div>
              <div className={css.options}>
                {questions[step].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.type)}
                    className={css.optionButton}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className={css.resultContainer}>
          {" "}
          {/* 결과 전용 컨테이너 */}
          <div ref={resultRef}>
            <div className={css.resultHeader}>
              <p className={css.resultSubtitle}>나의 개발자 유형은</p>
              <h2 className={css.resultHeading}>{result.title}</h2>
            </div>
            <img
              src={result.character}
              alt={result.title}
              className={css.resultImageLarge}
            />
            <div className={css.resultDescBox}>{result.desc.join("\n")}</div>
          </div>
          <div className={css.buttonGroup}>
            <button
              className={css.primaryButton}
              onClick={() => navigate("/news")}
            >
              프론트엔드 IT 뉴스 바로가기
            </button>
            <button className={css.outlinedButton} onClick={handleDownload}>
              결과 이미지 저장하기
            </button>
            <button className={css.primaryButton} onClick={handleRestart}>
              테스트 다시하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DevTypeTest;
