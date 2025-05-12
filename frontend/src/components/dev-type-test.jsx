import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";

import "./dev-type-test.css";

// 데이터
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
];

const results = {
  pikachu: {
    title: "💻 피카츄 프론트엔드",
    desc: "디자인 안 예쁘면 커밋 안 해요. border-radius가 안 들어가면 분노 게이지가 차오르고, 협업툴보다 Figma랑 친해요. 말버릇은 '폰트 왜 이래요??'",

    color: "#FFE5B4",
    character: "/img/pikachu-image.png", // 피카츄 이미지 경로
  },
  backend: {
    title: "⚙️ 고독한 백엔드 늑대인간",
    desc: "REST? 난 REST할 시간도 없어. 팀에선 조용히 살지만, 서버에선 절대 조용하지 않아요. Git log엔 항상 'fix: 버그 수정'만 남기고, 프론트엔드 요청이 3분 이상이면 '무슨 API를 이렇게 써요?'라고 해요.",

    color: "#E6E6FA",
    character: "/img/werewolf-image.png", // 늑대인간 이미지 경로
  },
  gpt: {
    title: "🤖 GPT 영혼합체 AI 개발자",
    desc: "사실 이 기능은 내가 안 짰는데... 코드보다 프롬프트에 진심이고, 디버깅할 때 GPT랑 대화가 60줄이에요. 프론트, 백 상관없이 GPT가 다 해주죠.",

    color: "#F0F8FF",
    character: "/img/robot-image.png", // 로봇 이미지 경로
  },
  data: {
    title: "📊 숫자덕후 데이터 집착러",
    desc: "사람보다 그래프가 더 솔직해요. 커밋보다 Recharts가 먼저고, 팀원들 이름 외우기보다 컬럼명 먼저 외워요. 코드 리뷰보다 SQL 튜닝이 더 재밌죠.",

    color: "#E0FFFF",
    character: "/img/data-analyst-image.png", // 데이터 분석가 이미지 경로
  },
  artist: {
    title: "🎨 클래스명 예술가",
    desc: "이 div에 영혼을 담았습니다. div 하나에도 스토리가 있고, className='soul-container emotion-center' 같은 걸 써요. 협업 시 팀원이 클래스명 보고 철학 질문을 하죠.",

    color: "#FFE4E1",
    character: "/img/artist-image.png", // 예술가 이미지 경로
  },
  deadline: {
    title: "⌛ 마감형 괴물 커밋러",
    desc: "마감 1시간 전이면 1주일 분량 가능해요. 잔디밭은 주말에 몰아서 조성하고, 매일은 못 해도 몰아서 폭주하는 열정 폭탄이에요. 커밋 메시지 시간은 항상 23:59죠.",

    color: "#FFF0F5",
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            🧪 GitPulse 개발자 유형 테스트
          </h1>

          {!isDone ? (
            <div className="space-y-8">
              <div className="w-full bg-gray-200/50 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
                <p
                  className="text-2xl md:text-3xl font-semibold mb-8 text-gray-800"
                  id="question-label"
                >
                  {questions[step].qNumber}. {questions[step].q}
                </p>
                <div
                  className="grid gap-4"
                  role="list"
                  aria-labelledby="question-label"
                >
                  {questions[step].options.map((opt, i) => (
                    <button
                      key={opt.type + i}
                      type="button"
                      tabIndex={0}
                      aria-label={opt.text}
                      onClick={() => handleAnswer(opt.type)}
                      className="btn btn-outline-primary w-full text-left px-6 py-4 rounded-xl"
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="mt-8">
              <div
                ref={resultRef}
                className="rounded-3xl p-10 shadow-xl transform transition-all duration-500 hover:shadow-2xl"
                aria-live="polite"
              >
                <div className="text-center mb-10">
                  <img
                    src={result.character}
                    alt={`${result.title} 캐릭터`}
                    className="w-20 h-20 mb-6 block"
                  />
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">
                    당신의 개발자 유형은?
                  </h2>
                  <p className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                    {result.title}
                  </p>
                  <p className="text-gray-700 text-xl leading-relaxed max-w-2xl mx-auto">
                    {result.desc}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="btn btn-secondary"
                >
                  다시 테스트하기
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-primary"
                >
                  결과 이미지 저장
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-6"></div>
              <p className="text-gray-600 text-lg">
                결과를 가져오고 있는 중입니다...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevTypeTest;
