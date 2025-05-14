import React from "react";

import baekjoon from "../assets/baekjoon.png";
import sw from "../assets/sw.png";
import leetcode from "../assets/leetcode.png";

import codingdojang from "../assets/codinggijang.png";
import css from "./Study.module.css";
const Study = () => {
  return (
    <div className={css.container}>
      <h2>코딩 공부 추천 사이트</h2>
      <div className={css.study}>
        <h3>1. 백준 온라인 저지</h3>
        <p>
          단계별 알고리즘 문제를 제공합니다. 채점 기능이 있고, 1초에도 수십 명이
          코드를 제출하는 가장 대중적인 사이트예요. 주제에 따라 문제를 모아둔
          '문제집' 카테고리가 있는데, 이 곳에서는 기업 실제 기출이나 유저가 직접
          경험한 문제들을 모아 공유하기도 합니다. 대학생 프로그래밍 경진대회가
          주기적으로 열리기도 하고, 유저 랭킹이나 커뮤니케이션을 위한 게시판
          기능도 있어요. 중고등, 대학생, 일반인 등 이용자 연령층이 가장 다양한
          곳입니다.
          <br />
          <br />
          <a href="https://www.acmicpc.net/">
            <img className={css.logo} src={baekjoon} alt="" />
          </a>
        </p>
      </div>
      <div className={css.study}>
        <h3>2. 삼성 SW Expert Academy</h3>
        <p>
          삼성 SW Expert Academy는 주기적으로, 자체적으로 다양한 난이도의
          연습문제를 업로드합니다. 프로그래밍 역량 강화를 위해 세 가지의 루틴을
          거칠 수 있도록 하고 있는데요. 연습문제를 풀고, 이론 및 지식을 학습할
          수 있도록 강의 콘텐츠 역시 제공합니다. 이 과정에서 생기는 궁금증,
          이슈는 커뮤니티 게시판을 통해 해결하도록 하고 있어요. 신입 개발자를
          위한 SW 역량 테스트 응시도 가능하답니다!
          <br />
          <br />
          <a href="https://swexpertacademy.com/main/main.do">
            <img className={css.logo} src={sw} alt="" />
          </a>
        </p>
      </div>
      <div className={css.study}>
        <h3>3. LeetCode</h3>
        <p>
          미국 사이트이며, 따로 한국어 지원을 하고있지 않습니다. 하지만 영어든
          한국어든, 프로그래밍 언어는 전세계 공통이니까요. ’색다른 느낌으로 코딩
          연습을 하고 싶다’, ‘국가의 한계를 넘어 미국의 코딩 문제도 경험해보고
          싶다’는 분에게 추천합니다. 해외 사이트 중에서는 국내 인지도가 높은
          편이며, 멤버십 유료 결제 시 다양한 종류의 스터디 플랜이나 인터뷰 등
          기능을 이용할 수 있으니 참고하세요.
          <br />
          <br />
          <a href="https://swexpertacademy.com/main/main.do">
            <img className={css.logo} src={leetcode} alt="" />
          </a>
        </p>
      </div>
      <div className={css.study}>
        <h3>4. 코딩도장</h3>
        <p>
          코딩 문제만 풀었는데 마치 게임처럼 배지를 주고, 랭킹도 매겨진다면
          얼마나 재밌을까요? 😋 코딩 도장에서는 난이도가 높은 문제를 풀었을 때,
          유저의 추천을 받았을 때 높은 포인트를 지급합니다. 바로 이 포인트로
          랭킹이 정해지게 된다고 해요! 또한, 유저가 문제 풀이를 등록할 수
          있는데요. 인기가 많은 문제의 경우 풀이 케이스만 1000개가 넘기도
          합니다. 유독 이 사이트에서 풀이가 많이 달리는 이유는 무엇일까요?
          <br />
          <br />
          <a href="https://swexpertacademy.com/main/main.do">
            <img className={css.cd} src={codingdojang} alt="" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default Study;
