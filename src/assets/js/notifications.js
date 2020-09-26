import { getSocket } from "./sockets";

const body = document.querySelector("body");

const fireNotification = (text, color) => {
  const notification = document.createElement("div");
  notification.innerText = text;
  notification.style.backgroundColor = color;
  notification.className = "notification";
  body.appendChild(notification);
};

export const handleNewuser = ({ username }) => {
  const text = `${username} just joined!`;
  const color = "rgb(0, 122, 255)";
  console.log("hihi", username);
  fireNotification(text, color);
  getSocket().emit(window.events.setNickname, { username });
};

export const handleDisconnected = ({ nickname }) => {
  const text = `${nickname} just left!`;
  const color = "rgb(255, 149, 0)";
  fireNotification(text, color);
};
