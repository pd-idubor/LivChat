import { io } from "socket.io-client";


const socket = io();

///Test
/*socket.on('connect', function () {
  socket.emit('echo', {msg: 'Hello universe!'}, function (response) {
    console.log(response.msg);
    socket.disconnect();  // otherwise the node process keeps on running.
  });
});
*/
//Actual

const inboxPeople = document.querySelector(".inbox__people");//Change to  chat icon click event;

let userName = "";

//Having conected ...
const userConnected = (user) => {
  userName = user;
  socket.emit(userName, "is active");
  addUser(userName);
};

const addUser = (userName) => {
  if (!!document.querySelector(`.${userName}-userlist`)) {
    return;
  }
  const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
  inboxPeople.innerHTML += userBox;
};

const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
  inboxPeople.innerHTML += userBox;
};

userConnected();

//User functionalities

socket.on("new user", function (data) {
  data.map((user) => addUser(user));
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});

//Message broadcast
//
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsgs = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  const sentMsgs = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  messageBox.innerHTML += user === userName ? sentMsgs : receivedMsgs;
};
  messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });

  inputField.value = "";
});
  
  socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});


socket.on("typing", function (data) {
  const { isTyping, nick } = data;
  
  if (!isTyping) {
    fallback.innerHTML = "";
    return;
  }

  fallback.innerHTML = `<p>${nick} is typing...</p>`;
});


