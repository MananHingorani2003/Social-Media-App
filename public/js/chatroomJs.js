const socket = io ('http://localhost:4000');

const form = document.getElementById ('send-container');
const messageInput = document.getElementById ('message');
const messageContainer = document.querySelector (".chat");

const append = (message, position) => {
    const messageElement = document.createElement ('div');
    messageElement.innerHTML = message;
    messageElement.classList.add ('message');
    messageElement.classList.add (position);
    messageContainer.append (messageElement);


}

const name2 = prompt ("Enter your name to join: ");
socket.emit ('new-user-joined', name2);

socket.on ('user-joined', data => {
    append (`${name2} joined the chat!`, 'right');

})