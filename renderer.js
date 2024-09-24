const inputField = document.getElementById('entry-box');
const API_KEY = "AIzaSyB-8_m7kiuNGgfNs_lns0ILwrrERfqfhjM";

let messages = [];

function renderMessages() {
    const AI_UI = document.getElementById('AI-UI');
    AI_UI.innerHTML = messages.map((message, i) => {
        return `<div class="message ${i % 2 === 0 ? 'user' : 'bot'}">${message.text}</div>`;
    }).join(''); // Join the array into a single string
}

function onEnterPress() {
    messages.push({"text": inputField.value});
    console.log("Enter key pressed!");
    inputField.value = "";

    // Render messages after adding a new one
    renderMessages();

    fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    messages
                ]
            }]
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        let message = data["candidates"][0]["content"]["parts"][0]["text"];
        console.log(message);
        messages.push({'text': `${message}`});
        
        // Render messages again to include the bot's response
        renderMessages();
    })
    .catch(err => console.log(err));
}

inputField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (!event.shiftKey) { // Check if Shift is NOT pressed
            event.preventDefault(); // Prevent new line
            if (inputField.value !== "") {
                onEnterPress();
            }
        }
    }
});