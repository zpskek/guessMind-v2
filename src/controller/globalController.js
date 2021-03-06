import passport from "passport";

import User from "../model/User";
import events from "../events";
import io from "../server";
import { sockets } from "../socketController";

const superBroadcast = (event, data) => io.emit(event, data);
const sendPlayerUpdate = () => superBroadcast(events.playerUpdate, { sockets });
const endGame = () => {
  superBroadcast(events.gameEnded);
};

export let currentUser = null;

export let logoutUser = null;

export const home = async (req, res) => {
  const JSONUser = JSON.stringify(currentUser);
  res.render("home", {
    events: JSON.stringify(events),
    users: sockets,
    JSONUser,
  });

  io.once("connection", () => {
    sendPlayerUpdate();
  });
};

export const getJoin = (req, res) => {
  try {
    res.render("join", { events: JSON.stringify(events) });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const postJoin = async (req, res, next) => {
  const {
    body: { username, password, password2 },
    file,
  } = req;

  if (password !== password2) {
    res.status(400);
    res.redirect("/");
  }
  try {
    const user = await User({
      username,
      avatarUrl: file ? file.path : null,
    });
    await User.register(user, password);
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const getLogin = async (req, res) => {
  try {
    res.render("login", { events: JSON.stringify(events) });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
};

export const postLogin = passport.authenticate("local", {
  failureRedirect: "/login",
});

export const loginNotify = async (req, res) => {
  const {
    user: { id },
  } = req;
  currentUser = await User.findById(id);
  const username = currentUser.username;
  const loginNotification = true;

  io.once("connection", (socket) => {
    io.to(socket.id).emit(events.newUser, { username, loginNotification });
  });

  sendPlayerUpdate();
  res.redirect("/login");
};

export const logout = async (req, res) => {
  const {
    user: { id },
  } = req;
  logoutUser = await User.findById(id);
  const itmeIdx = sockets.findIndex((aSocket) => aSocket.id === logoutUser.id);
  if (itmeIdx > -1) sockets.splice(itmeIdx, 1);
  io.emit(events.disconnected, { username: logoutUser.username });
  sendPlayerUpdate();
  endGame();

  req.logout();
  res.redirect("/");
};
