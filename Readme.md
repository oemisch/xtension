# xtension v0.0.1
The xtension library provides an abstraction layer for pain-free cross-browser extension development.

## Installation
Install the package with npm
```
$ npm install xtension --save
```

Include the script early in each head of your extension's html pages:
`<script type="text/javascript" src="../node_modules/xtension/index.js"></script>`

For content script extensions, make sure to include the script to your content_scripts:
On **Safari**, use the Extension Builder to add it as one of the first *Start Scripts* to the *Injected Content*.
On **Chrome**, open `manifest.json` and add it to your content_scripts:
```
"content_scripts": [{
    "js": ["scripts/xBrowser.js"]
}],
```

Congratulations! You are ready to develop your pain-free Browserextension.

## API
Call the extension layer with the global variable `xt`.
Example: `xt.getGlobal()`;

### getGlobal()
returns the global / background script of your extension including its variables and functions.
Example usage:
```
var globalPage = xt.getGlobal();
globalPage.yourFunction();
```

### messageGlobal(message, data)
Sends a Message to your background script. Returns a promise with a response from your global page.
Example usage:
```
xt.messageGlobal("requestInfo").then(function(response) {
   // do something with the response
});

//or with some data but without a response
xt.messageGlobal("clickedElement", elem);
```

### getUrl(path)
tbd
### messageAllTabs(message, data)
tbd
### messageActiveTab(message, data)
tbd
### messagePopover(message, data)
tbd
### openTab(url)
tbd
### createTab(url)
tbd
### changeLocation(url)
tbd
### setPopupWindow(url)
tbd
### browserInfo()
tbd
### addEventListener(name, handler)
tbd
### removeEventListener(name, handler)
tbd
### fireEvent(name, args[])
tbd
