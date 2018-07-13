# xtension v0.0.1
Develop one Browser-extension and ship it instantly for Safari, Chrome and more Browsers without adaptations. The xtension library provides an abstraction layer for pain-free cross browser extension development and a handful of API's I found useful while developing [Bloom](http://getbloom.de).

This is a new package I initially built for myself out of laziness and became my first open source project. Please report issues, request features and get in touch with me.

## Installation
Install the package with npm or download the script manually and add it to your Extension.
```
$ npm install xtension --save
```

## Getting Started

To get started with the development, I recommend to use the [Example Demo](http://github.com/oemisch/xtension/tree/master/example). Alternatively, you can start building a Safari Extension using the Safari Extension Builder.

If you start from scratch, the extension builder will create a folder `EXTENSION.safariextension` with nothing but an `Info.plist` file in it.

If you are building a content-script extension, make sure to include the script to your content_scripts:
On **Safari**, use the Extension Builder to add it as one of the first *Start Scripts* to the *Injected Content*.
On **Chrome**, open `manifest.json` in your root extension folder and add this library to your content_scripts:
```json
"content_scripts": [{
    "js": [
      "node_modules/xtension/index.js.js",
      "scripts/content_script.js"
    ]
}],
```

Include the script early in each head of your extension's html pages:
```html
<script type="text/javascript" src="../node_modules/xtension/index.js"></script>
```

Congratulations! You are ready to develop your pain-free Browserextension.

## Documentation
Call the extension layer with the global variable `xt`.
Example: `xt.getGlobal()`;

### getGlobal()
returns the global background script of your extension including its variables and functions.
Example usage:
```javascript
var globalPage = xt.getGlobal();
globalPage.yourFunction();
```

### messageGlobal(message, data)
Sends a Message to your global background script. Returns a promise with a response from your global page.
Example usage:
```javascript
xt.messageGlobal("requestInfo").then(function(response) {
   // do something with the response
});

//or with some data but without a response
xt.messageGlobal("clickedElement", elem);
```

### getUrl(path)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### messageAllTabs(message, data)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### messageActiveTab(message, data)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### messagePopover(message, data)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### openTab(url)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### createTab(url)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### changeLocation(url)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### setPopupWindow(url)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### browserInfo()
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### addEventListener(name, handler)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### removeEventListener(name, handler)
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
### fireEvent(name, args[])
Documentation work in Progress. Have a look at the comments in the index.js file in the meantime.
