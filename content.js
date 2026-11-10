// SecretKey Blocker - Content Script (v1.1 Update)

console.log("🛡️ SecretKey Blocker가 활성화되었습니다.");

// 1. 차단 대상 API 키 정규표현식(Regex) 패턴 정의
const API_KEY_PATTERNS = [
  { name: "OpenAI API Key", regex: /sk-(proj-)?[a-zA-Z0-9_-]{32,}/ },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub Personal Access Token", regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "Anthropic Claude API Key", regex: /sk-ant-[a-zA-Z0-9_-]{32,}/ }
];

// 2. 입력된 텍스트에서 API 키 감지 및 경고 처리 함수
function checkSensitivetext(text) {
  if (!text) return false;

  for (const pattern of API_KEY_PATTERNS) {
    if (pattern.regex.test(text)) {
      console.warn(`⚠️ [SecretKey Blocker] ${pattern.name} 패턴이 감지되었습니다!`);
      
      alert(
        `⚠️ [SecretKey Blocker 보안 경고]\n\n` +
        `입력창에서 [${pattern.name}] 패턴이 감지되었습니다!\n` +
        `실수로 외부에 유출되지 않도록 API 키를 삭제한 뒤 전송하세요.`
      );
      return true;
    }
  }
  return false;
}

// 3. 붙여넣기(Paste) 이벤트 전용 감지 (ChatGPT 등 Rich Text Editor 완벽 대응)
document.addEventListener("paste", (event) => {
  // 클립보드에 복사된 텍스트 데이터 직접 추출
  const pastedText = (event.clipboardData || window.clipboardData)?.getData("text");
  if (pastedText) {
    checkSensitivetext(pastedText);
  }
}, true);

// 4. 타이핑(Input) 이벤트 감지
document.addEventListener("input", (event) => {
  const target = event.target;
  // 입력창 본체 또는 상위 입력 영역 텍스트 추출
  const text = target.value || target.textContent || target.innerText || "";
  checkSensitivetext(text);
}, true);