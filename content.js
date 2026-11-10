// SecretKey Blocker - Content Script

console.log("🛡️ SecretKey Blocker가 활성화되었습니다.");

const API_KEY_PATTERNS = [
  { name: "OpenAI API Key", regex: /sk-(proj-)?[a-zA-Z0-9_-]{32,}/ },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub Personal Access Token", regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "Anthropic Claude API Key", regex: /sk-ant-[a-zA-Z0-9_-]{32,}/ }
];

function checkSensitivetext(text) {
  if (!text) return;

  // chrome.storage에서 현재 ON/OFF 활성화 상태 점검
  chrome.storage.local.get(["isEnabled"], (result) => {
    // 사용자가 OFF(false)로 설정한 경우 경고를 발생시키지 않음
    if (result.isEnabled === false) return;

    for (const pattern of API_KEY_PATTERNS) {
      if (pattern.regex.test(text)) {
        console.warn(`⚠️ [SecretKey Blocker] ${pattern.name} 패턴이 감지되었습니다!`);
        
        alert(
          `⚠️ [SecretKey Blocker 보안 경고]\n\n` +
          `입력창에서 [${pattern.name}] 패턴이 감지되었습니다!\n` +
          `실수로 외부에 유출되지 않도록 API 키를 삭제한 뒤 전송하세요.`
        );
        break;
      }
    }
  });
}

// 이벤트 리스너 (동일)
document.addEventListener("paste", (event) => {
  const pastedText = (event.clipboardData || window.clipboardData)?.getData("text");
  if (pastedText) checkSensitivetext(pastedText);
}, true);

document.addEventListener("input", (event) => {
  const target = event.target;
  const text = target.value || target.textContent || target.innerText || "";
  checkSensitivetext(text);
}, true);