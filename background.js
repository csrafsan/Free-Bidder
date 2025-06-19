// Background script to handle opening new tabs
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openChatGPT') {
        chrome.tabs.create({
            url: message.url,
            active: true
        });
    }
});