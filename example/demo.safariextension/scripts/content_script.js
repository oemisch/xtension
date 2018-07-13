// Send a message from your browser tab to the global background page
xt.messageGlobal("login", {username: "your_username", password: "user123"}).then((response) => {
  console.log(response);
});

// Listen to Messages from other parts of this Extension
xt.addEventListener("message", (action, data) => {
	switch(action){
    case "logout":
      console.log("The User has logged out.");
      break;
    default:
      break;
  }
});
