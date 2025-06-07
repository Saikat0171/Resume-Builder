// Simple localStorage-based chat and auth

const usersKey = "chat_users";
const messagesKey = "chat_messages";
let currentUser = null;

// Elements
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authMsg = document.getElementById('auth-message');
const chatSection = document.getElementById('chat-section');
const authSection = document.getElementById('auth-section');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const userList = document.getElementById('user-list');
const currentUserSpan = document.getElementById('current-user');

// Helper functions
function getUsers() {
    return JSON.parse(localStorage.getItem(usersKey) || "{}");
}
function setUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}
function getMessages() {
    return JSON.parse(localStorage.getItem(messagesKey) || "[]");
}
function setMessages(msgs) {
    localStorage.setItem(messagesKey, JSON.stringify(msgs));
}
function showChat() {
    authSection.style.display = "none";
    chatSection.style.display = "block";
    currentUserSpan.textContent = currentUser;
    logoutBtn.style.display = "inline-block"; // <-- Add this line
    loadUserList();
    loadMessages();
}
function showAuth() {
    authSection.style.display = "block";
    chatSection.style.display = "none";
    authMsg.textContent = "";
    logoutBtn.style.display = "none"; // <-- Add this line
}

// Auth logic
signupBtn.onclick = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    if (!username || !password) {
        authMsg.textContent = "Username and password required.";
        return;
    }
    let users = getUsers();
    if (users[username]) {
        authMsg.textContent = "Username already exists.";
        return;
    }
    users[username] = password;
    setUsers(users);
    authMsg.textContent = "Account created! Please log in.";
};

loginBtn.onclick = () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    let users = getUsers();
    if (users[username] && users[username] === password) {
        currentUser = username;
        localStorage.setItem("chat_current_user", currentUser);
        showChat();
    } else {
        authMsg.textContent = "Invalid username or password.";
    }
};

logoutBtn.onclick = () => {
    currentUser = null;
    localStorage.removeItem("chat_current_user");
    chatInput.value = "";
    userList.innerHTML = "";
    showAuth();
};

// User list logic
function loadUserList() {
    let users = getUsers();
    userList.innerHTML = "";
    Object.keys(users).forEach(u => {
        if (u !== currentUser) {
            const opt = document.createElement("option");
            opt.value = u;
            opt.textContent = u;
            userList.appendChild(opt);
        }
    });
}

// Chat logic (private messages)
sendBtn.onclick = () => {
    const msg = chatInput.value.trim();
    const toUser = userList.value;
    if (!msg || !toUser) return;
    let messages = getMessages();
    messages.push({
        from: currentUser,
        to: toUser,
        text: msg,
        time: Date.now()
    });
    setMessages(messages);
    chatInput.value = "";
    loadMessages();
};

function loadMessages() {
    let messages = getMessages();
    chatMessages.innerHTML = "";
    const selectedUser = userList.value;
    messages
        .filter(d =>
            (d.from === currentUser && d.to === selectedUser) ||
            (d.from === selectedUser && d.to === currentUser)
        )
        .slice(-50)
        .forEach(d => {
            const div = document.createElement("div");
            if (d.from === currentUser) {
                div.className = "chat-message me";
                div.innerHTML = `<span>${d.text}</span>`;
            } else {
                div.className = "chat-message other";
                div.innerHTML = `<span>${d.text}</span>`;
            }
            chatMessages.appendChild(div);
        });
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Update chat when user selection changes
userList && userList.addEventListener('change', loadMessages);

// Auto-login if user is already logged in
window.onload = () => {
    currentUser = localStorage.getItem("chat_current_user");
    if (currentUser) {
        showChat();
    } else {
        showAuth();
    }
};