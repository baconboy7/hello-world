let username = "";
let language = "";

document.getElementById("login").addEventListener("click", e => {
    e.preventDefault();
    username = document.getElementById("username").value;
    language = document.getElementById("lang").value;

    if (username !== "" && language !== "none") {
        toggleChat();
    }
});


document.getElementById("logout").addEventListener("click", () => {
    toggleChat();
});

function toggleChat() {
    if (document.getElementById("main-container").classList.contains("hidden")) {
        document.getElementById("main-container").classList.remove("hidden");
        document.getElementById("logout").classList.remove("hidden");
        document.getElementById("title").classList.add("hidden");
        document.getElementById("login-card").classList.add("hidden");
    }
    else {
        document.getElementById("main-container").classList.add("hidden");
        document.getElementById("logout").classList.add("hidden");
        document.getElementById("title").classList.remove("hidden");
        document.getElementById("login-card").classList.remove("hidden");
    }
}










//create a new WebSocket object.
websocket = new WebSocket("ws://146.148.83.72:9000");

//on open event
websocket.onopen = function(evt) {
    let message = {
        "type": "connection",
        "username": username,
        "language": language
    };
    websocket.send(JSON.stringify(message));
    console.log("connected to socket");
};
websocket.onclose = function(evt) { /* do stuff */ }; //on close event

//on message event
websocket.onmessage = function(evt) {
    let response = JSON.parse(evt.data);

    if (response.type === "message") {
        document.getElementById("chat-window").innerHTML += `
            <div class="chat__row">
                <div class="message message--left">
                    <div class="message__title message__title--left">
                        ${response.username}
                    </div>
                    <div class="message__body message__body--left">
                        ${response.message}
                    </div>
                </div>
             </div>
        `;
        document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
    }

    // else if (response.type === "connection"){
    //     document.getElementById("chat-window").innerHTML += `
    //         <div class="chat__row">
    //             <div class="message--system">
    //                 ${response.username} joined the chat
    //             </div>
    //          </div>
    //     `;
    //     document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
    //
    // }
    //
    // else if (response.type === "disconnection"){
    //     document.getElementById("chat-window").innerHTML += `
    //         <div class="chat__row">
    //             <div class="message--system">
    //                 ${response.username} left the chat
    //             </div>
    //          </div>
    //     `;
    //     document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
    //
    // }
};

websocket.onerror = function(evt) { /* do stuff */ }; //on error event

// Get the input field
const input = document.getElementById("chat-input");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {

        let message = input.value;

        document.getElementById("chat-window").innerHTML += `
            <div class="chat__row">
                <div class="message message--right">
                    <div class="message__title message__title--right">
                        You
                    </div>
                    <div class="message__body message__body--right">
                        ${message}
                    </div>
                </div>
            </div>
        `;
        document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;

        websocket.send(JSON.stringify({
            "type": "message",
            "username": username,
            "message": message,
            "language": language
        }));

        input.value = '';
    }
});

