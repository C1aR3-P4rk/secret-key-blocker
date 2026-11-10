// SecretKey Blocker - Background Service Worker

chrome.runtime.onMessage.addListener((message, sender) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  if (message.action === "KEY_DETECTED") {
    // 1. 아이콘 우측에 빨간색 느낌표(!) 배지 표시
    chrome.action.setBadgeText({ text: "!", tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#EF4444", tabId: tabId });

    // 2. 현재 탭 ID별로 감지 정보 저장
    chrome.storage.local.set({
      [`tab_${tabId}`]: {
        hasKey: true,
        keyName: message.keyName
      }
    });
  } else if (message.action === "KEY_CLEARED") {
    // 키가 삭제되거나 없으면 배지 제거
    chrome.action.setBadgeText({ text: "", tabId: tabId });
    chrome.storage.local.set({
      [`tab_${tabId}`]: {
        hasKey: false
      }
    });
  }
});