const toggle = document.getElementById("toggleState");
const alertBox = document.getElementById("alertBox");

function checkCurrentTabStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (!activeTab) return;

    const tabStorageKey = `tab_${activeTab.id}`;
    chrome.storage.local.get([tabStorageKey, "isEnabled"], (result) => {
      const isEnabled = result.isEnabled !== false;
      toggle.checked = isEnabled;

      if (!isEnabled) {
        alertBox.className = "alert-box safe";
        alertBox.innerHTML = "⚪ 실시간 감지가 중지되었습니다.";
        return;
      }

      const info = result[tabStorageKey];
      if (info && info.hasKey) {
        alertBox.className = "alert-box danger";
        alertBox.innerHTML = `⚠️ <b>${info.keyName}</b>가 감지되었습니다!<br>삭제 후 전송하세요.`;
      } else {
        alertBox.className = "alert-box safe";
        alertBox.innerHTML = "✅ 현재 감지된 API 키가 없습니다.";
      }
    });
  });
}

toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  chrome.storage.local.set({ isEnabled: isEnabled }, () => {
    checkCurrentTabStatus();
  });
});

document.addEventListener("DOMContentLoaded", checkCurrentTabStatus);