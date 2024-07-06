import { io } from "socket.io-client";


const socket = io();


const activePeople = document.querySelector("#active_users");

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
    activePeople.innerHTML += userBox;
};

const userBox = `
    <div class="chat_ib ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
activePeople.innerHTML += userBox;;

userConnected();

//User functionalities

socket.on("new user", function(data) {
    data.map((user) => addUser(user));
});

socket.on("user disconnected", function(userName) {
    document.querySelector(`.${userName}-userlist`).remove();
});

//Message broadcast
//
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector("#chat_messages");

const addNewMessage = ({ user, message }) => {
    const time = new Date();
    const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

    const receivedMsgs = `<div class="d-flex flex-row justify-content-start  mt-2">

                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava5-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">

                <div>

                    <div class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">
                        <p class="small mb-1">${user}</p>
                        <p class="mb-1">${message}
                        </p>
                        <p class="small mb-1 text-muted text-end">${formattedTime}</p>
                    </div>


                </div>

            </div>`;

    const recesth = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

    const sentMsgs = `<div class="d-flex flex-row justify-content-end  mt-2">

                <div>

                    <div class="small p-2 ms-3 mb-3 rounded-3 text-white" style="background-color: #008080;">
                        <p class="small mb-1">Johny Bullock</p>
                        <p class="mb-1">${message}</p>
                        <p class="small mb-1 text-muted text-end">${formattedTime}</p>
                    </div>


                </div>
                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">

            </div>`;
    const sentsth = `
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

socket.on("chat message", function(data) {
    addNewMessage({ user: data.nick, message: data.message });
});


socket.on("typing", function(data) {
    const { isTyping, nick } = data;

    if (!isTyping) {
        fallback.innerHTML = "";
        return;
    }

    fallback.innerHTML = `<p>${nick} is typing...</p>`;
});