if (localStorage.disabled == undefined) {
  localStorage.disabled = 0;
}

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the current page belongs to a wiki...
  if (tab.url.indexOf('/wiki/') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);

    if (localStorage.disabled == 1) {
      chrome.pageAction.setIcon({ path: "icon-disabled.png", tabId: tabId});
      chrome.pageAction.setTitle({ title: "QuickWiki is disabled.", tabId: tabId});
    }
  }
};

function disableQuickWiki(tab) {
  if (localStorage.disabled == 0) {
    localStorage.disabled = 1;
    chrome.pageAction.setIcon({path: "icon-disabled.png", tabId: tab.id});
    chrome.tabs.sendRequest(tab.id, { disable: 1 }, function () {
      chrome.pageAction.setTitle({ title: "QuickWiki is disabled.", tabId:tab.id });
    });
  }
  else {
    localStorage.disabled = 0;
    chrome.pageAction.setIcon({ path: "icon.png", tabId: tab.id });
    chrome.tabs.sendRequest(tab.id, {disable: 0}, function () {
      chrome.pageAction.setTitle({ title: "QuickWiki is enabled.", tabId: tab.id});
    });
  }
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  if (request.disable == 1) {
    disableQuickWiki(sender.tab);
    sendResponse({});
  }
  //			if(request.localstorage == 'disabled') {
  //				sendResponse({'disabled':localStorage.disabled});
  //			}
  else {
    sendResponse({});
  }
});

// Listen for any changes to the URL of any tab.
chrome.tabs.onUpdated.addListener(checkForValidUrl);

chrome.pageAction.onClicked.addListener(disableQuickWiki);
