// SecretKey Blocker - Content Script

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
  if (!text) return;

  for (const pattern of API_KEY_PATTERNS) {
    if (pattern.regex.test(text)) {
      console.warn(`⚠️ [SecretKey Blocker] ${pattern.name} 패턴이 감지되었습니다!`);
      
      // 브라우저 경고 팝업 띄우기
      alert(
        `⚠️ [SecretKey Blocker 보안 경고]\n\n` +
        `입력창에서 [${pattern.name}] 패턴이 감지되었습니다!\n` +
        `실수로 외부에 유출되지 않도록 API 키를 삭제한 뒤 전송하세요.`
      );
      break;
    }
  }
}

// 3. 웹페이지 내 모든 입력창의 타이핑 및 붙여넣기(Paste) 이벤트 실시간 감지
document.addEventListener("input", (event) => {
  const target = event.target;
  
  // input 태그, textarea 태그, 또는 ChatGPT처럼 contenteditable 속성을 가진 입력창 처리
  if (target.tagName === "TEXTAREA" || target.tagName === "INPUT" || target.isContentEditable) {
    const text = target.value || target.innerText || "";
    checkSensitivetext(text);
  }
}, true);