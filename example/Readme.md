# xtension example extension
This is an example of a Browser Extension for Safari and Chrome that simulates a login request from the content script and responds with a success and a subsequent logout from the global background page.

Feel free to use this example as a starting point for your new cross-browser extension.

## Installation
Run `npm install` inside the `demo.safariextension` folder to install this package.

## Getting Started
In Safari, open your extension builder and add the `demo.safariextension` folder to your Extensions.
On Chrome, go to `chrome://extensions/` and install the `demo.safariextension` folder as an unpacked extension.

You're done! Edit the extension scripts once and see changes in both browsers. Make sure to reload the extension every time in order to experience all updates.

## Deploy
Pack this Extension in Safari using the Safari Extension Builder.
To distribute your Chrome extension, compress the `demo.safariextension` folder and upload it to the chrome web store.
