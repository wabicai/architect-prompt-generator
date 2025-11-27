// Background service worker for Chrome extension
// Opens the app in a new tab (full screen)

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});
