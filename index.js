'use strict';

// develop one extension for cross browser usage
// originally written by Alexander Oemisch 2017 for http://getbloom.de

var xtension = (function() {
	var xt = {};
	var events = {};

	// Find Browser Type
	if (typeof chrome !== 'undefined') {
		// browser is chrome
		xt.browser = "chrome";
	} else if (typeof safari !== 'undefined') {
		// browser is safari
		xt.browser = "safari";
	}

	// get URL of local assets
	xt.getURL = function(path) {
		if (xt.browser == "chrome") {
			return chrome.extension.getURL(path);
		} else if (xt.browser == "safari") {
			return safari.extension.baseURI + path;
		}
	}

	// send a message to the background page aka. global script
	xt.getGlobal = function() {
		if (xt.browser == "chrome")
			return chrome.extension.getBackgroundPage();
		else if (xt.browser == "safari")
			return safari.extension.globalPage.contentWindow;
	}

	// returns a promise for simple communication handling in all browsers
	xt.messageGlobal = function(message, data) {
		return new Promise(function(resolve, reject) {
			if (xt.browser == "chrome") {
				chrome.runtime.sendMessage({
					action: message,
					data: data
				}, function(response) {
					resolve(response);
				});
			} else if (xt.browser == "safari") {
				safari.self.tab.dispatchMessage(message, data);
				// TODO: this just adds another listener at every messageGlobal() call
				// must be implemented in a clean way that prevents hundreds of event listeners
				safari.self.addEventListener("message", function(messageEvent) {
					if (messageEvent.name === message + ":back") {
						var response = messageEvent.message;
						resolve(response);
					}
				}, false)
			}
		});
	}

	// sends a message to the currently active popover
	xt.messagePopover = function(message, data) {
		if (xt.browser == "chrome") {
			var message = {
				action: message,
				data: data
			};
			chrome.runtime.sendMessage(message);
		} else if (xt.browser == "safari") {
			if (safari.extension.toolbarItems[0].popover.contentWindow.setLang)
				safari.extension.toolbarItems[0].popover.contentWindow[message](data);
		}
	}

	// send a message to all tabs
	xt.messageAllTabs = function(message, data) {
		if (xt.browser == "chrome") {
			chrome.tabs.query({}, function(tabs) {
				for (var i = 0; i < tabs.length; i++) {
					chrome.tabs.sendMessage(tabs[i].id, {
						action: message,
						data: data
					});
				}
			});
		} else if (xt.browser == "safari") {
			safari.application.browserWindows.forEach(function(browserWindow, windowKey) {
				browserWindow.tabs.forEach(function(tab, tabKey) {
					if (tab && tab.page) {
						tab.page.dispatchMessage(message, data);
					}
				});
			});
		}
	}

	// send a message to the active tab
	xt.messageActiveTab = function(message, data) {
		if (xt.browser == "chrome") {
			chrome.tabs.query({
				currentWindow: true,
				active: true
			}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {
					action: message,
					data: data
				});
			});
		} else if (xt.browser == "safari") {
			safari.application.activeBrowserWindow.activeTab.page.dispatchMessage(message, data);
		}
	}

	// opens a url in this tab
	xt.openTab = function(url){
		if (xt.browser == "chrome") {
			return chrome.tabs.create({url: url});
		} else if(xt.browser == "safari"){
			var tab = safari.application.activeBrowserWindow.openTab();
			tab.url = url;
			return tab;
		}
	}

	// creates a new tab with defined URL
	xt.createTab = function(url) {
		if (xt.browser == "chrome") {
			chrome.tabs.create({
				url: url
			});
		} else if (xt.browser == "safari") {
			safari.application.activeBrowserWindow.openTab().url = url;
		}
	}

	// initiate event listeners for background messages
	xt.initMessageListener = function() {
		if (xt.browser == "chrome") {
			chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
				var args = {
					message: request.action,
					data: request.data,
					sendResponse: sendResponse
				};
				xt.fireEvent('message', [args.message, args.data, args.sendResponse]);
				return true; // keep the channel open for asynchronous requests
			});
		} else if (xt.browser == "safari") {
			// implementation for background script
			if (safari.application) {
				//TODO: test and make sure only one event listener gets created here
				safari.application.addEventListener('message', function(messageEvent) {
					// create custom sendResponse function for safari
					var sendResponse = function(response) {
						console.log("Message", messageEvent);
						messageEvent.target.page.dispatchMessage(messageEvent.name + ':back', response);
					};
					var args = {
						message: messageEvent.name,
						data: messageEvent.message,
						sendResponse: sendResponse
					};
					xt.fireEvent('message', [args.message, args.data, args.sendResponse]);
				});
			}
			// implementation for content script
			if (safari.self && safari.self.addEventListener) {
				// safari.self.removeEventListener("message");
				safari.self.addEventListener("message", function(messageEvent) {
					var args = {
						message: messageEvent.name,
						data: messageEvent.message
					}
					xt.fireEvent('message', [args.message, args.data]);
				}, false);
			}
		}
	}

	// to be called from popover, changes location of the current popover page
	xt.changeLocation = function(newLocation) {
		if (xt.browser == "chrome") {
			window.location.href = newLocation;
		} else if (xt.browser == "safari") {
			safari.self.contentWindow.location.href = newLocation;
		}
	}

	// sets popup window from the global page
	xt.setPopupWindow = function(filename) {
		if (xt.browser == "chrome") {
			chrome.browserAction.setPopup({
				popup: '/views/' + filename
			});
		} else if (xt.browser == "safari") {
			if (safari.extension.toolbarItems[0].popover != null && safari.extension.toolbarItems[0].popover.contentWindow.changeLocation)
				safari.extension.toolbarItems[0].popover.contentWindow.changeLocation(filename);
		}
	}

	// get information about the curren browser and extension version
	xt.browserInfo = function(){
		var info = {
			extensionVersion: null,
			browser: null
		};

		if (xt.browser == "chrome") {
			info.extensionVersion = chrome.runtime.getManifest().version;
			info.browser = "Chrome";
		} else if (xt.browser == "safari") {
			info.extensionVersion = safari.extension.displayVersion;
			info.browser = "Safari";
		}

		return info;
	}

	xt.addEventListener = function(name, handler) {
		if (events.hasOwnProperty(name))
			events[name].push(handler);
		else
			events[name] = [handler];
	};

	xt.removeEventListener = function(name, handler) {
		//TODO: find out what I meant by that comment a year ago
		/* This is a bit tricky, because how would you identify functions?
		   This simple solution should work if you pass THE SAME handler. */
		if (!events.hasOwnProperty(name))
			return;

		var index = events[name].indexOf(handler);
		if (index != -1)
			events[name].splice(index, 1);
	};

	xt.fireEvent = function(name, args) {
		if (!events.hasOwnProperty(name))
			return;

		if (!args || !args.length)
			args = [];

		var evs = events[name],
			l = evs.length;
		for (var i = 0; i < l; i++) {
			evs[i].apply(null, args);
		}
	};

	// establish communication pipeline
	xt.initMessageListener();

	return xt;
}());

var xt = xtension; // short for xtension
