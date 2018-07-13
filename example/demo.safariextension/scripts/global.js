xt.addEventListener("message", function(message, data, callback) {
  console.log("Message Received", message, data);
	switch (message) {
		case "login":
      // handle login with data from the message
      login(data.username, data.password).then((username) => {
        callback("User " + username + " has logged in")
      });
      break;
    default:
      break;
    }
});

function login(username, password){
  // Simulate an asychronous request
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      window.setTimeout(() => {
        xt.messageAllTabs("logout");
      }, 2000);
      resolve(username);
    }, 500);
  });
}
