// PR review 라인 몇번째 줄인지 찾기
export const getPositionInPatch = (patch, lineIndex) => {
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
