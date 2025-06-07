document.addEventListener("DOMContentLoaded", () => {
    const usersKey = "chat_users";
    const messagesKey = "chat_messages";
    let currentUser = localStorage.getItem("chat_current_user");

    // Elements
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const userList = document.getElementById('user-list');
    const currentUserSpan = document.getElementById('current-user');
    const sidebarPic = document.getElementById('sidebar-pic');
    const sidebarName = document.getElementById('sidebar-name');
    const sidebarAge = document.getElementById('sidebar-age');
    const sidebarLocation = document.getElementById('sidebar-location');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const logoutBtn = document.getElementById('logout-btn');

    // Helpers
    function getUsers() {
        return JSON.parse(localStorage.getItem(usersKey) || "{}");
    }
    function getMessages() {
        return JSON.parse(localStorage.getItem(messagesKey) || "[]");
    }
    function setMessages(msgs) {
        localStorage.setItem(messagesKey, JSON.stringify(msgs));
    }
    function getProfiles() {
        return JSON.parse(localStorage.getItem("chat_profiles") || "{}");
    }
    function loadProfile(username) {
        return getProfiles()[username] || {};
    }

    // UI
    function showChat() {
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }
        currentUserSpan.textContent = currentUser;
        updateSidebarProfile();
        loadUserList();
        loadMessages();
    }

    // Logout
    logoutBtn.onclick = function () {
        localStorage.removeItem("chat_current_user");
        window.location.href = "login.html";
    };

    // User list
    function loadUserList() {
        const users = getUsers();
        userList.innerHTML = "";
        Object.keys(users).forEach(u => {
            if (u !== currentUser) {
                const opt = document.createElement("option");
                opt.value = u;
                opt.textContent = u;
                userList.appendChild(opt);
            }
        });

        sendBtn.disabled = userList.options.length === 0;
        if (userList.options.length > 0) {
            userList.selectedIndex = 0;
            loadMessages();
        } else {
            chatMessages.innerHTML = "<div style='color:#888;text-align:center;margin-top:40px;'>No other users to chat with.</div>";
        }
    }

    // Send message
    sendBtn.onclick = () => {
        if (!currentUser) return;
        const msg = chatInput.value.trim();
        const toUser = userList.value;
        if (!msg || !toUser) return;

        const messages = getMessages();
        messages.push({
            from: currentUser,
            to: toUser,
            text: msg,
            time: Date.now(),
            profile: loadProfile(currentUser)
        });
        setMessages(messages);
        chatInput.value = "";
        loadMessages();
    };

    // Show messages
    function loadMessages() {
        const messages = getMessages();
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
                let profile = d.profile || {};
                if (d.from === currentUser) {
                    div.className = "chat-message me";
                    div.innerHTML = `
                        <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;">
                            <span>${d.text}</span>
                            ${profile.pic ? `<img src="${profile.pic}" alt="Me" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid #007bff33;">` : ""}
                        </div>
                    `;
                } else {
                    let otherProfile = loadProfile(d.from);
                    div.className = "chat-message other";
                    div.innerHTML = `
                        <div style="display:flex;align-items:center;gap:8px;">
                            ${otherProfile.pic ? `<img src="${otherProfile.pic}" alt="${d.from}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:1.5px solid #007bff33;">` : ""}
                            <span>${d.text}</span>
                        </div>
                    `;
                }
                chatMessages.appendChild(div);
            });
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Sidebar
    function updateSidebarProfile() {
        const data = loadProfile(currentUser);
        const defaultPic = "https://ui-avatars.com/api/?name=User&background=eee&color=aaa&size=70";
        sidebarPic.innerHTML = `<img src="${data.pic ? data.pic : defaultPic}" alt="Profile Picture">`;
        sidebarName.textContent = data.name ? data.name : currentUser;
        sidebarAge.textContent = data.age ? `Age: ${data.age}` : '';
        sidebarLocation.textContent = data.location ? `Location: ${data.location}` : '';
    }

    // Edit profile
    editProfileBtn.onclick = function () {
        window.location.href = "profile.html";
    };

    // User change
    userList.addEventListener('change', () => {
        sendBtn.disabled = !userList.value;
        loadMessages();
    });

    // Enter key sends
    chatInput.addEventListener('keydown', function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            sendBtn.click();
        }
    });

    // Load test data if empty
    function initTestUsers() {
        const users = getUsers();
        const profiles = getProfiles();

        if (!users["alice"]) users["alice"] = "123";
        if (!users["bob"]) users["bob"] = "123";

        if (!profiles["alice"]) profiles["alice"] = { name: "Alice", age: 22, location: "NY", pic: "" };
        if (!profiles["bob"]) profiles["bob"] = { name: "Bob", age: 24, location: "LA", pic: "" };

        localStorage.setItem(usersKey, JSON.stringify(users));
        localStorage.setItem("chat_profiles", JSON.stringify(profiles));

        // Auto-login as Alice if not already
        if (!currentUser) {
            currentUser = "alice";
            localStorage.setItem("chat_current_user", "alice");
        }
    }

    initTestUsers();
    showChat();
});