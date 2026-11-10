// SecretKey Blocker - Content Script (v1.5 Update)

console.log("🛡️ SecretKey Blocker가 활성화되었습니다.");

const API_KEY_PATTERNS = [
  { name: "OpenAI API Key", regex: /sk-(proj-)?[a-zA-Z0-9_-]{32,}/ },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/ },
  { name: "GitHub Personal Access Token", regex: /ghp_[a-zA-Z0-9]{36}/ },
  { name: "Anthropic Claude API Key", regex: /sk-ant-[a-zA-Z0-9_-]{32,}/ }
];

function checkSensitivetext(text) {
  if (typeof text !== "string") text = "";

  chrome.storage.local.get(["isEnabled"], (result) => {
    // ON/OFF 스위치가 꺼져있으면 배지 해제
    if (result.isEnabled === false) {
      chrome.runtime.sendMessage({ action: "KEY_CLEARED" });
      return;
    }

    let detectedPattern = null;
    if (text.trim().length > 0) {
      for (const pattern of API_KEY_PATTERNS) {
        if (pattern.regex.test(text)) {
          detectedPattern = pattern.name;
          break;
        }
      }
    }

    if (detectedPattern) {
      console.warn(`⚠️ [SecretKey Blocker] ${detectedPattern} 감지됨!`);
      chrome.runtime.sendMessage({ action: "KEY_DETECTED", keyName: detectedPattern });
    } else {
      // 텍스트에서 API 키가 완전히 지워졌으면 배지 즉시 해제
      chrome.runtime.sendMessage({ action: "KEY_CLEARED" });
    }
  });
}

// 현재 활성화된 입력창의 전체 텍스트 추출 헬퍼 함수
function checkCurrentActiveInput() {
  // 에디터가 DOM에서 글자를 지울 때까지 10ms 대기 후 텍스트 추출
  setTimeout(() => {
    const el = document.activeElement;
    if (!el) return;

    // contenteditable 최상위 컨테이너 또는 input/textarea 추출
    const container = el.closest('[contenteditable="true"]') || el;
    const text = container.value || container.textContent || container.innerText || "";
    checkSensitivetext(text);
  }, 10);
}

// 1. 붙여넣기(Paste) 이벤트
document.addEventListener("paste", (event) => {
  const pastedText = (event.clipboardData || window.clipboardData)?.getData("text");
  if (pastedText) {
    checkSensitivetext(pastedText);
  }
  checkCurrentActiveInput();
}, true);

// 2. 잘라내기(Cut) 이벤트
document.addEventListener("cut", checkCurrentActiveInput, true);

// 3. 타이핑 및 입력(Input) 이벤트
document.addEventListener("input", checkCurrentActiveInput, true);

// 4. Backspace & Delete 키 누름 감지 (keydown + keyup 모두 추적)
document.addEventListener("keydown", (event) => {
  if (event.key === "Backspace" || event.key === "Delete") {
    checkCurrentActiveInput();
  }
}, true);

document.addEventListener("keyup", (event) => {
  if (event.key === "Backspace" || event.key === "Delete") {
    checkCurrentActiveInput();
  }
}, true);