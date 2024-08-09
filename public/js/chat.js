const socket = io();

console.log("Chat js file loaded");

//const response = fetch('/username', {method: 'GET',});
//console.log(response, " Fetch response");

const form = document.getElementById('message_form');
const input = document.getElementById('message_input');
const messages = document.getElementById('messages');
const currentUser = document.getElementById('user').textContent;
console.log("Username in client js: ", currentUser);
//messages.innerHTML = "";

const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
  
  const receivedMsg = `<div class="d-flex flex-row justify-content-start  mt-2">
	<img src="https://mdbcdn.b-cdn.net/img/Photos/ne
w-templates/bootstrap-chat/ava5-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">
	<div>
	<div class="small p-2 ms-3 mb-3 rounded-3" style="background-color: #f5f6f7;">
		<p class="small mb-1">${user}</p>
		<p class="mb-1">${message}</p>
		<p class="small mb-1 text-muted text-end">${formattedTime}</p>
	</div>
	</div>
</div>`;


  const sentMsg = `<div class="d-flex flex-row justify-content-end  mt-2">
	<div>
	<div class="small p-2 ms-3 mb-3 rounded-3 text-white" style="background-color: #008080;">
		<p class="mb-1">${message}</p>
		<p class="small mb-1 text-muted text-end">${formattedTime}</p>
	</div>
	</div>
	<img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava6-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;">
</div>`;


messages.innerHTML += user === currentUser ? sentMsg : receivedMsg;
};

form.addEventListener('submit', (e) => {
  console.log("Form submission");
  e.preventDefault();
    if (input.value) {
      socket.emit('chat message', {
	      user: currentUser,
	      message: input.value});
      input.value = '';
    }
});

socket.on('chat message', (data) => {
  console.log("About to begin");
  addNewMessage({ user: data.user, message: data.message });
});
