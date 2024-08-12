const socket = io();
let currentUser;
let userImg;
console.log("Live chat loaded...");

// Fetch user details
const fetchUser = async() => {
    try {
        const response = await fetch('/chat', {
            method: 'GET',
        });
        console.log("Response for chat: ", response);
        user = await response.json();

        console.log("Type of User features: ", typeof(user));
        console.log("User features actual: ", user);
        console.log("Image from chat js file: ", user.image);
        currentUser = user.username;
        userImg = user.image;
        console.log("UserImg: ", userImg);


    } catch (error) {
        console.error(error);
    }
};
fetchUser();

const form = document.getElementById('message_form');
const input = document.getElementById('message_input');
const messages = document.getElementById('messages');
const count = document.getElementById('count');
const type = document.getElementById('type');

console.log("Username in client js: ", currentUser);

const addNewMessage = ({ user, message, image }) => {
    const time = new Date();
    const formattedTime = `${time.toLocaleString("en-US", {month: "short"})} ` + `${time.toLocaleString("en-US", { day:"numeric", hour: "numeric", minute: "numeric" }).toLocaleLowerCase()}`
        // = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" }).toLocaleLowerCase();

    const receivedMsg = `<div class="d-flex flex-row justify-content-start  mt-2">
	<img src="${image}" class="rounded-circle" height="30" alt="User's avatar" loading="lazy" />
    <div>
	<div class="small p-2 ms-2 mb-2 rounded-3" style="background-color: #f5f6f7;">
		<p class="small mb-1">${user}</p>
		<p class="mb-1">${message}</p>
		<p class="small mb-1 text-muted text-end">${formattedTime}</p>
	</div>
	</div>
</div>`;


    const sentMsg = `<div class="d-flex flex-row justify-content-end  mt-2">
	<div>
	<div class="small p-2 mx-2 mb-2 rounded-3 text-white" style="background-color: #008080;">
		<p class="mb-1">${message}</p>
		<p class="small mb-1 text-end" style="color:#aeb1b0">${formattedTime}</p>
	</div>
	</div>
    <img src="${image}" class="rounded-circle" height="30" alt="User's avatar" loading="lazy" />
  
	</div>`;


    messages.innerHTML += user === currentUser ? sentMsg : receivedMsg;
    messages.lastElementChild.scrollIntoView({ behavior: 'smooth' });
};

form.addEventListener('submit', (e) => {
    console.log("Form submission");
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', {
            user: currentUser,
            message: input.value,
            image: userImg
        });
        input.value = '';
    }
});

input.addEventListener('keyup', () => {
    socket.emit('typing', {
        isTyping: input.value.length > 0,
        user: currentUser
    });
});

socket.on('stats', function(data) {
    console.log('Connected clients:', data.userCount);
    count.innerText = data.userCount;
});

socket.on('typing', function(data) {
    const { isTyping, user } = data;
    if (!isTyping) {
        type.innerText = "";
        return;
    }
    type.innerText = `${user} is typing...`;
});

socket.on('chat message', (data) => {
    console.log("About to begin");
    addNewMessage({ user: data.user, message: data.message, image: data.image });
    console.log("Last child element text: ", messages.lastElementChild);
});