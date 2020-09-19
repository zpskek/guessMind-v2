const { initSocket } = require("./sockets");

const body = document.querySelector("body");
const loginForm = document.getElementById("jsLogin");

const NICKNAME = "nickname";
const LOGGED_OUT = "loggedOut";
const LOGGED_IN = "loggedIn";

const logIn = (nickname) => {
  const socket = io("/");
  socket.emit(window.events.setNickname, { nickname });
  initSocket(socket);
};

const handleSubmitLogin = (e) => {
  e.preventDefault();
  const input = loginForm.querySelector("input");
  const { value } = input;
  localStorage.setItem(NICKNAME, value);
  input.value = "";
  logIn(value);
};

if (loginForm) {
  loginForm.addEventListener("submit", handleSubmitLogin);
}

const nickname = localStorage.getItem(NICKNAME);

if (nickname === null) {
  body.className = LOGGED_OUT;
} else {
  body.className = LOGGED_IN;
  logIn(nickname);
}
