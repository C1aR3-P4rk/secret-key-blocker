const toggle = document.getElementById("toggleState");
const statusText = document.getElementById("statusText");

// ON/OFF 상태에 따라 하단 텍스트 UI 업데이트 함수
function updateStatusUI(isEnabled) {
  if (isEnabled) {
    statusText.textContent = "🟢 실시간 감지 작동 중";
    statusText.style.color = "#059669";
  } else {
    statusText.textContent = "⚪ 감지 일시 중단됨";
    statusText.style.color = "#6b7280";
  }
}

// 1. 현재 저장된 ON/OFF 상태 불러오기
chrome.storage.local.get(["isEnabled"], (result) => {
  const isEnabled = result.isEnabled !== false;
  toggle.checked = isEnabled;
  updateStatusUI(isEnabled);
});

// 2. 사용자가 스위치를 토글할 때
toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ isEnabled: isEnabled });
  updateStatusUI(isEnabled);
});