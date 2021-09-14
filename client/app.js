const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

socket.on('message', ({ author, content }) => addMessage(author, content)); //socket.on('message', (event) => addMessage(event.author, event.content));

const login = (event) => {
  event.preventDefault();

  if(userNameInput.value) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', { name: userName, id: socket.id });
  } else {
    alert('Type your login!');
  }
};

const sendMessage = (event) => {
  event.preventDefault();

  let messageContent = messageContentInput.value;

  if(!messageContent.length) {
    alert('You have to type something!');
  }
  else {
    addMessage(userName, messageContent);
    socket.emit('message', { author: userName, content: messageContent });
    messageContentInput.value = '';
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if(author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author }</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);